import os

import gridfs
import motor
from bson import ObjectId
from fastapi import APIRouter
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
from pymongo import MongoClient
from starlette.responses import StreamingResponse

router = APIRouter()
client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017/dlisfy")
db2 = client.dlisfy
db = MongoClient().dlisfy
fs = gridfs.GridFS(db)


@router.get("/song/{id}")
async def getSongById(id: str):
    file = await download_file(id)
    return StreamingResponse(file.get('file'), media_type=file.get('type'))

async def chunk_generator(grid_out):
    while True:
        # chunk = await grid_out.read(1024)
        chunk = await grid_out.readchunk()
        if not chunk:
            break
        yield chunk


async def download_file(file_id):
    """Returns iterator over AsyncIOMotorGridOut object"""
    fsBucket = AsyncIOMotorGridFSBucket(db2)
    grid_out = await fsBucket.open_download_stream(ObjectId(file_id))
    return {"file": chunk_generator(grid_out), "type": grid_out.content_type}
