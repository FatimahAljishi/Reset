import os
from typing import Any

import httpx
from fastapi import HTTPException, status


CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")


async def get_clerk_user(user_id: str) -> dict[str, Any]:
    if not CLERK_SECRET_KEY:
        raise RuntimeError(
            "CLERK_SECRET_KEY environment variable is not set"
        )

    url = f"https://api.clerk.com/v1/users/{user_id}"

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                url,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": (
                        f"Bearer {CLERK_SECRET_KEY}"
                    ),
                },
            )
    except httpx.RequestError as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Could not connect to Clerk.",
        ) from error

    if response.status_code == 404:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Clerk user was not found.",
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not retrieve Clerk user.",
        )

    return response.json()

def get_customer_name(clerk_user: dict[str, Any]) -> str:
    first_name = clerk_user.get("first_name") or ""
    last_name = clerk_user.get("last_name") or ""

    full_name = f"{first_name} {last_name}".strip()

    if full_name:
        return full_name

    # Fall back to the username if the user has no first/last name.
    username = clerk_user.get("username")

    if username:
        return username

    return "Reset customer"

def get_customer_email(clerk_user: dict[str, Any]) -> str:
    email_addresses = clerk_user.get("email_addresses", [])

    return (
        email_addresses[0]["email_address"]
        if email_addresses
        else ""
    )

