from pydantic import BaseModel, Field, EmailStr
from backend.model.PyObjectId import PyObjectId
from bson import ObjectId
from typing import Optional, List

class SongModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str = Field(...)
    artists: list = Field(default_factory=list)
    album: str = Field(...)
    duration: int = Field(...)
    data: str = Field(...)
    numberPlay: int = Field(...)
    styles: list = Field(default_factory=list)
    image: str = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "title": "Song 1",
                "artists": ["Artist 1", "Artist 2"],
                "album": "Album 1",
                "duration": 120,
                "rate": 5,
                "data": ["5d12d1f", "d12fd1f5", "5d5fd1f2"],
                "numberPlay": 0,
                "styles": ["sddsd4VSDvd", "sdvds5vsdv22"]
            }
        }
class UpdateSongModel(BaseModel):

    title:Optional[str]
    artists:Optional[list]
    album:Optional[str]
    duration:Optional[int]
    data: str = Field(...)
    numberPlay:Optional[int]
    styles:Optional[list]
    image: str = Field(...)


    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "title": "Song 1",
                "artists": ["Artist 1", "Artist 2"],
                "album": "Album 1",
                "image": Field(...),
                "duration": 120,
                "data": ["5d12d1f", "d12fd1f5", "5d5fd1f2"],
                "numberPlay": 0,
                "styles": ["sddsd4VSDvd", "sdvds5vsdv22"]
            }
        }