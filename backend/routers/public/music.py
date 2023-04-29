from __future__ import annotations

import asyncio
import base64
import os
from datetime import datetime, timedelta
from typing import Annotated

from bson import ObjectId
from fastapi import APIRouter,status,HTTPException
from mutagen.mp3 import MP3
from mutagen.wave import WAVE
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from fastapi import Header, HTTPException, status
from pymongo import MongoClient

from backend.model.Album import AlbumModel
from backend.model.Artist import ArtistModel
from backend.model.Song import SongModel,SongModelLite
from backend.model.Style import StyleModel
import motor.motor_asyncio
from jose import JWTError, jwt

from backend.model.User import UserModelOut

SECRET_KEY="09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM="HS256"


router = APIRouter()
client = MongoClient()
db = client["dlisfy"]
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@router.get("/style/{page_number}", response_model=list[StyleModel])
async def getStyles(page_number:int):
    try:
        style =  db.style.find().skip((page_number-1)*100).limit(100)
        return style
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Style not found")
@router.get("/style/id/{style_id}", response_model=StyleModel)
async def getStyleById(style_id:str):
    try:
        style =  db.style.find_one({"_id": style_id})
        return style
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Style not found")
@router.get("/artist/id/{artist_id}", response_model=ArtistModel)
async def getArtistById(artist_id:str):
    try:
        artist = db.artist.find_one({"_id": ObjectId(artist_id)})
        return artist
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Artist not found")
@router.get("/artist/{page_number}", response_model=list[ArtistModel])
async def getArtists(page_number:int):
    try:
        artist =  db.artist.find().skip((page_number-1)*100).limit(100)
        return artist
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Artist not found")

@router.get("/artist/style/{style_id}", response_model=list[ArtistModel])
async def getArtistsByStyle(style_id:str):
    try:
        songs =  db.song.find({"styles": {"$in": style_id}})
        artist =  db.artist.find({"_id": {"$in": [song["artist"] for song in songs]}})
        return artist
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Artist not found")
@router.get("/artist/search/{artist_name}", response_model=list[ArtistModel])
async def searchArtists(artist_name:str):
    try:
        artist = [doc for doc in db.artist.find({"name": {"$regex": artist_name}})]
        return artist
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Artist not found")


@router.get("/song/id/{song_id}", response_model=SongModel)
async def getSongById(song_id:str):
    try:
        song =  db.song.find_one({"_id": ObjectId(song_id)})
        if song.get("duration") is None:
            decoded_data = base64.b64decode(song.get("data"), ' /')
            # save audio file
            file = open("temp", "wb")
            file.write(decoded_data)
            audio = None
            if song.get("type") == "audio/wav":
                audio = WAVE("temp")
            if song.get("type") == "audio/mp3" or song.get("type") == "audio/mpeg":
                audio = MP3("temp")
            db.song.update_one({"_id": ObjectId(song_id)}, {"$set": {"duration": audio.info.length}})
            song =  db.song.find_one({"_id": ObjectId(song_id)})
        return song
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Song not found")
@router.get("/song/artist/{artist_id}", response_model=list[SongModel])
async def getSongsByArtist(artist_id:str):
    try:
        song = [doc  for doc in db.song.find({"artists": artist_id})]
        return song
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Song not found")
@router.get("/song/style/{style_id}", response_model=list[SongModel])
async def getSongsByStyle(style_id:str):
    try:
        song = [doc  for doc in db.song.find({"styles": style_id})]
        return song
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Song not found")

@router.get("/songid/likes", response_model=list[str])
async def getSongsIdByLikes(x_token: Annotated[str,Header()]):
    try:
        payload = jwt.decode(x_token, SECRET_KEY, algorithms=[ALGORITHM])
        user = db.user.find_one({"_id": ObjectId(payload.get("sub"))})
        if user.get("likes") is None:
            return []
        return user.get("likes")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Songs not found")
@router.get("/song/likes", response_model=list[SongModel])
async def getSongsByLikes(x_token: Annotated[str,Header()]):
    try:
        payload = jwt.decode(x_token, SECRET_KEY, algorithms=[ALGORITHM])
        user = db.user.find_one({"_id": ObjectId(payload.get("sub"))})
        likes = list(map(lambda likeId: ObjectId(likeId),user.get("likes")))
        songs = [doc for doc in db.song.find({"_id": {"$in": likes}})]
        return songs
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Songs not found")
@router.post("/song/like/{song_id}", response_model=list[str])
async def likeSong(song_id:str,x_token: Annotated[str,Header()]):
    try:
        payload = jwt.decode(x_token, SECRET_KEY, algorithms=[ALGORITHM])
        user = db.user.find_one({"_id": ObjectId(payload.get("sub"))})
        if user.get("likes") is None:
            db.user.update_one({"_id": ObjectId(payload.get("sub"))}, {"$set": {"likes": [song_id]}})
            return {"message": "Song liked"}
        if song_id not in user.get("likes"):
             db.user.update_one({"_id": ObjectId(payload.get("sub"))}, {"$push": {"likes": song_id}})
        else :
             db.user.update_one({"_id": ObjectId(payload.get("sub"))}, {"$pull": {"likes": song_id}})
        user = db.user.find_one({"_id": ObjectId(payload.get("sub"))})
        if user.get("likes") is None:
            return []
        return user.get("likes")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Song not found")




@router.get("/song/album/{album_id}", response_model=list[SongModel])
async def getSongsByAlbum(album_id:str):
    try:
        song = [doc for doc in db.song.find({"album": album_id})]
        return song
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Song not found")
@router.get("/song/search/{song_name}", response_model=list[SongModelLite])
async def searchSongs(song_name:str):
    try:
        song = [doc for doc in db.song.find({"title": {"$regex": song_name}})]
        return song
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Song not found")

@router.get("/album/{page_number}", response_model=list[AlbumModel])
async def getAlbums(page_number:int):
    try:
        album =  db.album.find().skip((page_number-1)*100).limit(100)
        return album
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Album not found")
@router.get("/album/id/{album_id}", response_model=AlbumModel)
async def getAlbumById(album_id:str):
    try:
        album =  db.album.find_one({"_id": album_id})
        return album
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Album not found")
@router.get("/album/artist/{artist_id}", response_model=list[AlbumModel])
async def getAlbumsByArtist(artist_id:str):
    try:
        album =  db.album.find({"artist": artist_id})
        return album
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Album not found")
@router.get("/album/style/{style_id}", response_model=list[AlbumModel])
async def getAlbumsByStyle(style_id:str):
    try:
        songs =  db.song.find({"styles": {"$in": style_id}})
        album =  db.album.find({"_id": {"$in": [song["album"] for song in songs]}})
        return album
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Album not found")
@router.get("/album/search/{album_name}", response_model=list[AlbumModel])
async def searchAlbums(album_name:str):
    try:
        album = [doc for doc in db.album.find({"title": {"$regex": album_name}})]
        return album
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Album not found")
@router.get("/style/search/{style_name}", response_model=list[StyleModel])
async def searchStyles(style_name:str):
    try:
        style = [doc for doc in db.style.find({"name": {"$regex": style_name}})]
        return style
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Style not found")
@router.get("/user",response_model=UserModelOut)
async def getUser(x_token: Annotated[str,Header()]):
    try:
        payload = jwt.decode(x_token, SECRET_KEY, algorithms=[ALGORITHM])
        user = db.user.find_one({"_id": ObjectId(payload.get("sub"))},{"password":0})
        return user
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found")