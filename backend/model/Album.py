from pydantic import BaseModel, Field, EmailStr
from backend.model.PyObjectId import PyObjectId
from bson import ObjectId
from typing import Optional, List

class AlbumModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str = Field(...)
    year: int = Field(...)
    artists: list = Field(default_factory=list)
    image: str = Field(...)
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "title": "The Dark Side of the Moon",
                "year": 1973,
                "artist": "Pink Floyd",
            }
        }
class UpdateAlbumModel(BaseModel):
    title:Optional[str]
    year:Optional[int]
    artists:Optional[list]
    image: Optional[str]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "title": "The Dark Side of the Moon",
                "year": 1973,
                "artist": "Pink Floyd",

            }
        }