from typing import Optional

from bson import ObjectId
from pydantic import BaseModel, Field

import PyObjectId


class StyleModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(...)
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "Rock",
            }
        }
class UpdateStyleModel(BaseModel):
    name:Optional[str]
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "name": "Rock",
            }
        }