import os

import gridfs
import motor
from bson import ObjectId
from fastapi import APIRouter
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
from pymongo import MongoClient
from starlette.responses import StreamingResponse

router = APIRouter()


MONGO_URL=os.getenv("MONGO_URL") or "mongodb://localhost:27017"
SECRET_KEY=os.getenv("SECRET_KEY") or "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM=os.getenv("ALGORITHM") or "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES") or 1440


client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db2 = client.dlisfy

db = MongoClient(MONGO_URL).dlisfy
fs = gridfs.GridFS(db)

@router.get("/")
async def getSong():
    return {"message": "Hello World"}
@router.get("/song/{id}")
async def getSongById(id: str):
    print(id)
    file = await download_file(id)
    return StreamingResponse(file.get('file'), media_type=file.get('type'))

async def chunk_generator(grid_out):
    while True:
        chunk = await grid_out.readchunk()
        if not chunk:
            break
        yield chunk


async def download_file(file_id):
    """Returns iterator over AsyncIOMotorGridOut object"""
    fsBucket = AsyncIOMotorGridFSBucket(db2)
    grid_out = await fsBucket.open_download_stream(ObjectId(file_id))
    return {"file": chunk_generator(grid_out), "type": grid_out.content_type}
