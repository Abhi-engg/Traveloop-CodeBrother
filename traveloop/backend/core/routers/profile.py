from ninja import Router
from ninja_jwt.authentication import JWTAuth

from core.schemas import UserProfileIn, UserProfileOut

router = Router(tags=["profile"], auth=JWTAuth())


def _get_display_name(user) -> str:
    if user.first_name or user.last_name:
        return f"{user.first_name} {user.last_name}".strip()
    return user.username


@router.get("/", response=UserProfileOut)
def get_profile(request):
    user = request.user
    return UserProfileOut(
        id=user.id,
        username=user.username,
        name=_get_display_name(user),
        email=user.email,
        language=user.language or None,
        photo_url=user.photo_url or "",
        privacy=user.privacy or "private",
        saved_destinations=list(user.saved_destinations or []),
    )


@router.put("/", response=UserProfileOut)
def update_profile(request, payload: UserProfileIn):
    user = request.user
    name = payload.name.strip()
    if " " in name:
        first, _, last = name.partition(" ")
        user.first_name = first
        user.last_name = last.strip()
    else:
        user.first_name = name
        user.last_name = ""

    user.email = payload.email.strip()
    user.language = (payload.language or "").strip()
    user.photo_url = payload.photo_url or ""
    user.privacy = (payload.privacy or "private").strip() or "private"
    user.saved_destinations = payload.saved_destinations or []
    user.save(
        update_fields=[
            "first_name",
            "last_name",
            "email",
            "language",
            "photo_url",
            "privacy",
            "saved_destinations",
        ]
    )

    return UserProfileOut(
        id=user.id,
        username=user.username,
        name=_get_display_name(user),
        email=user.email,
        language=user.language or None,
        photo_url=user.photo_url or "",
        privacy=user.privacy or "private",
        saved_destinations=list(user.saved_destinations or []),
    )


@router.delete("/", response={204: None})
def delete_account(request):
    request.user.delete()
    return 204, None
