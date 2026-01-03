from datetime import datetime

from pydantic import BaseModel


class CommunityPostAuthor(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    name: str | None = None
    photo_url: str | None = None


class CommunityPostResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    content: str
    created_at: datetime
    user: CommunityPostAuthor


class CommunityPostCreate(BaseModel):
    content: str
