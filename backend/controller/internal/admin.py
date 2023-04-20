import os

from fastapi import APIRouter,status,HTTPException

from backend.model.Style import StyleModel
import motor.motor_asyncio
from dotenv import load_dotenv
load_dotenv()
router = APIRouter()
client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv("MONGODB_URL"))
db = client.dlisfy


@router.post("/admin/style", )
async def addStyle(style: StyleModel):
    try:
        await db.style.insert_one(style.dict())
        return HTTPException(status_code=status.HTTP_201_CREATED, detail="Style added")
    except:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Style not added")

