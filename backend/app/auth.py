import os
import jwt
from fastapi import Header, HTTPException, status, Depends
from jwt import PyJWKClient
from app.services.clerk_service import get_clerk_user


CLERK_ISSUER = os.getenv("CLERK_ISSUER")

if not CLERK_ISSUER:
    raise RuntimeError("CLERK_ISSUER environment variable is not set")


JWKS_URL = f"{CLERK_ISSUER}/.well-known/jwks.json"
jwks_client = PyJWKClient(JWKS_URL)


async def get_current_user_id(
    authorization: str | None = Header(default=None),
) -> str:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is missing",
        )

    scheme, _, token = authorization.partition(" ")

    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
        )

    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=CLERK_ISSUER,
            options={
                "require": ["exp", "iat", "sub"],
            },
        )

        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Clerk user ID is missing from token",
            )

        return user_id

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session token has expired",
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session token",
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not verify session token",
    )

async def get_current_trainer_id(
    user_id: str = Depends(get_current_user_id),
) -> str:
    clerk_user = await get_clerk_user(user_id)

    public_metadata = (
        clerk_user.get("public_metadata") or {}
    )

    if public_metadata.get("role") != "trainer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Trainer access is required.",
        )

    return user_id