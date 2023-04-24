from pydantic import BaseModel, Field, EmailStr
from backend.model.PyObjectId import PyObjectId
from bson import ObjectId
from typing import Optional, List

class SongModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str = Field(...)
    artists: list = Field(default_factory=list)
    album: Optional[str] = None
    data: str = Field(...)
    duration: Optional[int] = None
    numberPlay: Optional[int] = None
    styles: list = Field(default_factory=list)
    image: str = Field(...)
    type: str = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        exclude_unset = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "title": "Song 1",
                "artists": ["Artist 1", "Artist 2"],
                "album": "Album 1",
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
    data: Optional[str]
    numberPlay:Optional[int]
    duration:Optional[int]
    styles:Optional[list]
    image: Optional[str]
    type: Optional[str]


    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "title": "Song 1",
                "artists": ["Artist 1", "Artist 2"],
                "album": "Album 1",
                "image": Field(...),
                "data": ["5d12d1f", "d12fd1f5", "5d5fd1f2"],
                "numberPlay": 0,
                "styles": ["sddsd4VSDvd", "sdvds5vsdv22"]
            }
        }

class SongModelLite(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str = Field(...)
    artists: list = Field(default_factory=list)
    album: Optional[str] = None
    duration: Optional[int] = None
    data: str = Field(...)
    numberPlay: Optional[int] = None
    styles: list = Field(default_factory=list)
    image: str = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        exclude_unset = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "title": "Song 1",
                "artists": ["Artist 1", "Artist 2"],
                "album": "Album 1",
                "rate": 5,
                "numberPlay": 0,
                "styles": ["sddsd4VSDvd", "sdvds5vsdv22"]
            }
        }