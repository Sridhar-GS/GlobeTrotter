from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    email: EmailStr
    name: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    photo_url: str | None = None
    phone_number: str | None = None
    city: str | None = None
    country: str | None = None
    additional_info: str | None = None
    language: str | None = None
    is_admin: bool = False


class UserUpdate(BaseModel):
    name: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    photo_url: str | None = None
    phone_number: str | None = None
    city: str | None = None
    country: str | None = None
    additional_info: str | None = None
    language: str | None = None

