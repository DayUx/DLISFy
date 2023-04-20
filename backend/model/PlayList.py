from pydantic import BaseModel, Field, EmailStr
from backend.model.PyObjectId import PyObjectId
from bson import ObjectId
from typing import Optional, List

class PlayListModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    songs: list = Field(default_factory=list)
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "songs": ["5d12d1f", "d12fd1f5", "5d5fd1f2"],
            }
        }
class UpdatePlayListModel(BaseModel):
    songs:Optional[list]
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "songs": ["5d12d1f", "d12fd1f5", "5d5fd1f2"],
            }
        }