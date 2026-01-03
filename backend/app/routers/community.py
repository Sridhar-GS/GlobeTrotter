from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.community_post import CommunityPost
from app.models.user import User
from app.schemas.community import CommunityPostCreate, CommunityPostResponse

router = APIRouter(prefix="/community", tags=["community"])


@router.get("/posts", response_model=list[CommunityPostResponse])
def list_posts(limit: int = 50, db: Session = Depends(get_db)):
    limit = max(1, min(100, limit))
    rows = (
        db.query(CommunityPost)
        .options(joinedload(CommunityPost.user))
        .order_by(CommunityPost.created_at.desc())
        .limit(limit)
        .all()
    )
    return rows


@router.post("/posts", response_model=CommunityPostResponse)
def create_post(
    payload: CommunityPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    content = (payload.content or "").strip()
    if not content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Content required")

    post = CommunityPost(user_id=current_user.id, content=content)
    db.add(post)
    db.commit()
    db.refresh(post)

    post = (
        db.query(CommunityPost)
        .options(joinedload(CommunityPost.user))
        .filter(CommunityPost.id == post.id)
        .one()
    )
    return post


@router.delete("/posts/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.get(CommunityPost, post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    if post.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")

    db.delete(post)
    db.commit()
    return {"deleted": True}
