from __future__ import annotations

from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field, EmailStr
from backend.model.PyObjectId import PyObjectId
from bson import ObjectId
from typing import Optional, List
from passlib.context import CryptContext


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None

class UserModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    username: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)
    likes: list = Field(default_factory=list)
    playlists: list = Field(default_factory=list)
    admin: bool = Field(default=False)
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "username": "DayUx",
                "email": "dayux@example.com",
                "password": "Passwd1",
                "likes": ["5d12d1f", "d12fd1f5", "5d5fd1f2"],
                "playlists": ["4s5d21fsdf45sdf", "4511sgfdbdf", "dfdfd4f5df51"]

            }
        }
class UpdateUserModel(BaseModel):
    username:Optional[str]
    email:Optional[EmailStr]
    password:Optional[str]
    likes:Optional[list]
    playlists:Optional[list]
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "username": "DayUx",
                "email": "dayux@example.com",
                "password": "Passwd1",
                "likes": ["5d12d1f", "d12fd1f5", "5d5fd1f2"],
                "playlists": ["4s5d21fsdf45sdf", "4511sgfdbdf", "dfdfd4f5df51"]
            }
        }


