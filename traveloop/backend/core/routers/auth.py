import os
import secrets

import requests
from django.contrib.auth import get_user_model
from ninja import Router, Schema
from ninja.errors import HttpError
from ninja_jwt.tokens import RefreshToken

router = Router(tags=["auth"])
User = get_user_model()

# ── Google OAuth helpers ────────────────────────────────────────────

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI", "")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


# ── Shared schemas ──────────────────────────────────────────────────

class GoogleCallbackIn(Schema):
    code: str


class RegisterIn(Schema):
    email: str
    username: str
    password: str
    first_name: str = ""
    last_name: str = ""


class LoginIn(Schema):
    email: str
    password: str


class TokenOut(Schema):
    access: str
    refresh: str
    user: dict


class MessageOut(Schema):
    detail: str


# ── Helper: issue JWT pair for a user ───────────────────────────────

def _build_token_response(user):
    """Return a JWT pair + user profile dict."""
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
        },
    }


# ═══════════════════════════════════════════════════════════════════
#  1. Register (email + password)
# ═══════════════════════════════════════════════════════════════════

@router.post("/register", response=TokenOut)
def register_user(request, payload: RegisterIn):
    """Create a new account and return JWT tokens."""
    if User.objects.filter(email=payload.email).exists():
        raise HttpError(400, "An account with this email already exists.")

    if User.objects.filter(username=payload.username).exists():
        raise HttpError(400, "This username is taken.")

    if len(payload.password) < 6:
        raise HttpError(400, "Password must be at least 6 characters.")

    user = User.objects.create_user(
        username=payload.username,
        email=payload.email,
        password=payload.password,
        first_name=payload.first_name,
        last_name=payload.last_name,
    )

    return _build_token_response(user)


# ═══════════════════════════════════════════════════════════════════
#  2. Login (email + password)
# ═══════════════════════════════════════════════════════════════════

@router.post("/login", response=TokenOut)
def login_user(request, payload: LoginIn):
    """Authenticate with email + password and return JWT tokens."""
    try:
        user = User.objects.get(email=payload.email)
    except User.DoesNotExist:
        raise HttpError(401, "Invalid email or password.")

    if not user.check_password(payload.password):
        raise HttpError(401, "Invalid email or password.")

    return _build_token_response(user)


# ═══════════════════════════════════════════════════════════════════
#  3. Google OAuth – redirect URL
# ═══════════════════════════════════════════════════════════════════

@router.get("/google/login")
def google_login(request):
    """Return the Google OAuth URL the frontend should redirect to."""
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }
    qs = "&".join(f"{k}={v}" for k, v in params.items())
    return {"url": f"{GOOGLE_AUTH_URL}?{qs}"}


# ═══════════════════════════════════════════════════════════════════
#  4. Google OAuth – callback
# ═══════════════════════════════════════════════════════════════════

@router.post("/google/callback", response=TokenOut)
def google_callback(request, payload: GoogleCallbackIn):
    """
    Exchange the authorization code for Google tokens,
    fetch user info, get-or-create a local user, and
    return a JWT pair.
    """
    # Exchange code for tokens
    token_response = requests.post(
        GOOGLE_TOKEN_URL,
        data={
            "code": payload.code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        },
        timeout=10,
    )
    token_data = token_response.json()

    if "error" in token_data:
        raise HttpError(400, f"Google token error: {token_data.get('error_description', token_data['error'])}")

    # Fetch user profile from Google
    userinfo_response = requests.get(
        GOOGLE_USERINFO_URL,
        headers={"Authorization": f"Bearer {token_data['access_token']}"},
        timeout=10,
    )
    userinfo = userinfo_response.json()

    email = userinfo.get("email", "")
    first_name = userinfo.get("given_name", "")
    last_name = userinfo.get("family_name", "")

    if not email:
        raise HttpError(400, "Google account has no email address.")

    # Get or create local user
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            "username": email.split("@")[0] + "_" + secrets.token_hex(3),
            "first_name": first_name,
            "last_name": last_name,
        },
    )

    if not created:
        # Update names in case they changed on Google
        user.first_name = first_name
        user.last_name = last_name
        user.save(update_fields=["first_name", "last_name"])

    return _build_token_response(user)
