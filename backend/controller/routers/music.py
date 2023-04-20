from __future__ import annotations

import os
from datetime import datetime, timedelta

from fastapi import APIRouter,status,HTTPException
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer

from backend.model.Album import AlbumModel
from backend.model.Artist import ArtistModel
from backend.model.Song import SongModel
from backend.model.Style import StyleModel
import motor.motor_asyncio
from dotenv import load_dotenv
from jose import JWTError, jwt

load_dotenv()


router = APIRouter()
client = motor.motor_asyncio.AsyncIOMotorClient(os.environ["MONGODB_URL"])
db = client.dlisfy
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@router.get("/style/{page_number}", response_model=list[StyleModel])
async def getStyles(page_number:int):
    try:
        style = await db.style.find().skip((page_number-1)*100).limit(100)
        return style
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Style not found")
@router.get("/style/{style_id}", response_model=StyleModel)
async def getStyleById(style_id:str):
    try:
        style = await db.style.find_one({"_id": style_id})
        return style
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Style not found")
@router.get("/artist/{artist_id}", response_model=ArtistModel)
async def getArtistById(artist_id:str):
    try:
        artist = await db.artist.find_one({"_id": artist_id})
        return artist
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Artist not found")
@router.get("/artist/{page_number}", response_model=list[ArtistModel])
async def getArtists(page_number:int):
    try:
        artist = await db.artist.find().skip((page_number-1)*100).limit(100)
        return artist
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Artist not found")

@router.get("/artist/style/{style_id}", response_model=list[ArtistModel])
async def getArtistsByStyle(style_id:str):
    try:
        songs = await db.song.find({"styles": {"$in": style_id}})
        artist = await db.artist.find({"_id": {"$in": [song["artist"] for song in songs]}})
        return artist
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Artist not found")

@router.get("/song/{page_number}", response_model=list[SongModel])
async def getSongs(page_number:int):
    try:
        song = await db.song.find().skip((page_number-1)*100).limit(100)
        return song
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Song not found")
@router.get("/song/{song_id}", response_model=SongModel)
async def getSongById(song_id:str):
    try:
        song = await db.song.find_one({"_id": song_id})
        return song
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Song not found")
@router.get("/song/artist/{artist_id}", response_model=list[SongModel])
async def getSongsByArtist(artist_id:str):
    try:
        song = await db.song.find({"artist": artist_id})
        return song
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Song not found")
@router.get("/song/style/{style_id}", response_model=list[SongModel])
async def getSongsByStyle(style_id:str):
    try:
        song = await db.song.find({"styles": {"$in": style_id}})
        return song
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Song not found")
@router.get("/album/{page_number}", response_model=list[AlbumModel])
async def getAlbums(page_number:int):
    try:
        album = await db.album.find().skip((page_number-1)*100).limit(100)
        return album
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Album not found")
@router.get("/album/{album_id}", response_model=AlbumModel)
async def getAlbumById(album_id:str):
    try:
        album = await db.album.find_one({"_id": album_id})
        return album
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Album not found")
@router.get("/album/artist/{artist_id}", response_model=list[AlbumModel])
async def getAlbumsByArtist(artist_id:str):
    try:
        album = await db.album.find({"artist": artist_id})
        return album
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Album not found")
@router.get("/album/style/{style_id}", response_model=list[AlbumModel])
async def getAlbumsByStyle(style_id:str):
    try:
        songs = await db.song.find({"styles": {"$in": style_id}})
        album = await db.album.find({"_id": {"$in": [song["album"] for song in songs]}})
        return album
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Album not found")
