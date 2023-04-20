import os

from bson import ObjectId
from fastapi import APIRouter,status,HTTPException

from backend.model.Artist import ArtistModel
from backend.model.Song import SongModel
from backend.model.Style import StyleModel
import motor.motor_asyncio
router = APIRouter()
client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv("MONGODB_URL"))
db = client.dlisfy

@router.get("/")
async def hasAccess():
    return HTTPException(status_code=status.HTTP_200_OK, detail="Access granted")
@router.post("/style", )
async def addStyle(style: StyleModel):
    try:
        await db.style.insert_one(style.dict())
        return HTTPException(status_code=status.HTTP_201_CREATED, detail="Style added")
    except:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Style not added")

@router.post("/artist", )
async def addArtist(artist: ArtistModel):
    try:
        await db.artist.insert_one(artist.dict())
        return HTTPException(status_code=status.HTTP_201_CREATED, detail="Artist added")
    except:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Artist not added")
@router.put("/artist/{artist_id}", )
async def updateArtist(artist_id:str, artist: ArtistModel):
    try:
        await db.artist.update_one({"_id": ObjectId(artist_id)}, {"$set": artist.dict()})
        return HTTPException(status_code=status.HTTP_201_CREATED, detail="Artist updated")
    except:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Artist not updated")

@router.post("/song", )
async def addSong(song: SongModel):
    try:
        await db.song.insert_one(song.dict())
        return HTTPException(status_code=status.HTTP_201_CREATED, detail="Song added")
    except:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Song not added")