import base64
import os
import traceback
from http.client import RemoteDisconnected
from typing import Optional
from xmlrpc.client import ProtocolError

import gridfs
import motor.motor_asyncio
import requests
import youtube_dl as youtube_dl
from bson import ObjectId
from fastapi import APIRouter, status, HTTPException, UploadFile, File
from mutagen.wave import WAVE
from mutagen.mp3 import MP3
from mutagen.wave import WAVE
from pydantic import BaseModel, Field
from pymongo import MongoClient
from pythumb import Thumbnail
from pytube import YouTube
from pytube.exceptions import VideoUnavailable, AgeRestrictedError, VideoRegionBlocked, RecordingUnavailable, \
    VideoPrivate, LiveStreamError, MembersOnly
from requests import ConnectTimeout
from requests.exceptions import InvalidURL, HTTPError

from backend.model.Album import AlbumModel
from backend.model.Artist import ArtistModel
from backend.model.PyObjectId import PyObjectId
from backend.model.Song import SongModel, UpdateSongModel, SongModelYoutube
from backend.model.Style import StyleModel

router = APIRouter()
db = MongoClient().dlisfy
fs = gridfs.GridFS(db)


@router.get("/")
async def hasAccess():
    return HTTPException(status_code=status.HTTP_200_OK, detail="Access granted")


@router.post("/style", )
async def addStyle(style: StyleModel):
    try:
        db.style.insert_one(style.dict())
        return HTTPException(status_code=status.HTTP_201_CREATED, detail="Style added")
    except:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Style not added")


@router.post("/artist", )
async def addArtist(artist: ArtistModel):
    try:
        db.artist.insert_one(artist.dict())
        return HTTPException(status_code=status.HTTP_201_CREATED, detail="Artist added")
    except:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Artist not added")


@router.put("/artist/{artist_id}", )
async def updateArtist(artist_id: str, artist: ArtistModel):
    try:
        db.artist.update_one({"_id": ObjectId(artist_id)}, {"$set": artist.dict()})
        return HTTPException(status_code=status.HTTP_201_CREATED, detail="Artist updated")
    except:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Artist not updated")


class SongDTO(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str = Field(...)
    artists: list = Field(default_factory=list)
    album: Optional[str] = None
    file: UploadFile = File(...)
    duration: Optional[int] = None
    numberPlay: Optional[int] = None
    styles: list = Field(default_factory=list)
    image: str = Field(...)
    type: str = Field(...)


@router.post("/song", )
async def addSong(song: SongModel):
    if len(song.data.strip()) == 0:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Veuillez ajouter un fichier audio")
    if len(song.title.strip()) == 0:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Veuillez ajouter un titre")
    if len(song.image.strip()) == 0:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Veuillez ajouter une image")
    try:
        decoded_data = base64.b64decode(song.data, ' /')
        # save audio file
        file = open("temp", "wb")
        file.write(decoded_data)
        audio = None
        if song.type == "audio/wav":
            audio = WAVE("temp")
        if song.type == "audio/mp3" or song.type == "audio/mpeg":
            audio = MP3("temp")
        id = fs.put(decoded_data, filename=song.title, content_type=song.type)
        song.duration = audio.info.length
        song.data = str(id)
        db.song.insert_one(song.dict())
        return HTTPException(status_code=status.HTTP_201_CREATED, detail="Song added")
    except Exception as e:
        print(e)
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Song not added")


@router.put("/song/{song_id}", )
async def updateSong(song_id: str, song: UpdateSongModel):
    try:

        # remove attributes that are not in the model
        if song.data is not None:
            decoded_data = base64.b64decode(song.data, ' /')
            # save audio file
            file = open("temp", "wb")
            file.write(decoded_data)
            audio = None
            if song.type == "audio/wav":
                audio = WAVE("temp")
            if song.type == "audio/mp3" or song.type == "audio/mpeg":
                audio = MP3("temp")
            id = fs.put(decoded_data, filename=song.title, content_type=song.type)
            song.duration = audio.info.length
            song.data = str(id)

        db.song.update_one({"_id": ObjectId(song_id)}, {"$set": song.dict(exclude_unset=True)})
        return HTTPException(status_code=status.HTTP_201_CREATED, detail="Song updated")
    except Exception as e:
        print(e)
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Song not updated")


@router.delete("/song/{song_id}", )
async def deleteSong(song_id: str):
    try:
        db.song.delete_one({"_id": ObjectId(song_id)})
        return HTTPException(status_code=status.HTTP_201_CREATED, detail="Song deleted")
    except:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Song not deleted")


@router.post("/album", )
async def addAlbum(album: AlbumModel):
    try:
        db.album.insert_one(album.dict())
        return HTTPException(status_code=status.HTTP_201_CREATED, detail="Album added")
    except:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Album not added")


@router.put("/album/{album_id}", )
async def updateAlbum(album_id: str, album: AlbumModel):
    try:
        db.album.update_one({"_id": ObjectId(album_id)}, {"$set": album.dict()})
        return HTTPException(status_code=status.HTTP_201_CREATED, detail="Album updated")
    except Exception as e:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Album not updated")


@router.post("/style", )
async def addStyle(style: StyleModel):
    try:
        db.style.insert_one(style.dict())
        return HTTPException(status_code=status.HTTP_201_CREATED, detail="Style added")
    except:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Style not added")


@router.put("/style/{style_id}", )
async def updateStyle(style_id: str, style: StyleModel):
    try:
        db.style.update_one({"_id": ObjectId(style_id)}, {"$set": style.dict()})
        return HTTPException(status_code=status.HTTP_201_CREATED, detail="Style updated")
    except:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Style not updated")