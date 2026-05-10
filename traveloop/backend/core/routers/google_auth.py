import secrets
from urllib.parse import urlencode

import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpResponseBadRequest, HttpResponseRedirect
from ninja import Router

from ninja_jwt.tokens import RefreshToken

router = Router(tags=["auth"])

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo"


@router.get("/google/login")
def google_login(request):
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_REDIRECT_URI:
        return HttpResponseBadRequest("Google OAuth is not configured.")

    state = secrets.token_urlsafe(24)
    request.session["google_oauth_state"] = state

    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "online",
        "prompt": "consent",
    }
    url = f"{GOOGLE_AUTH_URL}?{urlencode(params)}"
    return HttpResponseRedirect(url)


@router.get("/google/callback")
def google_callback(request, code: str = "", state: str = ""):
    expected_state = request.session.pop("google_oauth_state", None)
    if not code or not state or state != expected_state:
        return HttpResponseBadRequest("Invalid OAuth state or code.")

    token_response = requests.post(
        GOOGLE_TOKEN_URL,
        data={
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        },
        timeout=10,
    )
    token_response.raise_for_status()
    token_data = token_response.json()
    access_token = token_data.get("access_token")

    userinfo_response = requests.get(
        GOOGLE_USERINFO_URL,
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=10,
    )
    userinfo_response.raise_for_status()
    profile = userinfo_response.json()

    email = profile.get("email")
    if not email:
        return HttpResponseBadRequest("Google account email not available.")

    User = get_user_model()
    user, _ = User.objects.get_or_create(
        email=email,
        defaults={
            "username": _make_username(User, email),
            "first_name": profile.get("given_name", ""),
            "last_name": profile.get("family_name", ""),
        },
    )
    if not user.has_usable_password():
        user.set_unusable_password()
        user.save(update_fields=["password"])

    refresh = RefreshToken.for_user(user)
    redirect_url = f"{settings.FRONTEND_URL}/login?token={refresh.access_token}"
    return HttpResponseRedirect(redirect_url)


def _make_username(user_model, email: str) -> str:
    base = email.split("@", 1)[0]
    username = base
    counter = 1
    while user_model.objects.filter(username=username).exists():
        counter += 1
        username = f"{base}{counter}"
    return username
