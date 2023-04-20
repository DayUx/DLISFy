from pydantic import BaseModel, Field, EmailStr
import PyObjectId
from bson import ObjectId
from typing import Optional, List

class ArtistModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(...)
    image: str = Field(...)
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "Pink Floyd",
            }
        }
class UpdateArtistModel(BaseModel):
    name:Optional[str]
    image: str = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "name": "Pink Floyd",
            }
        }