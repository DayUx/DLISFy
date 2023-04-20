import os

import motor.motor_asyncio
from fastapi import Header, HTTPException, status
from dotenv import load_dotenv
from jose import JWTError, jwt

load_dotenv()
client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv("MONGODB_URL"))
db = client.dlisfy


async def isAdmin(x_token: str = Header("X-Token")):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(x_token, os.environ["SECRET_KEY"], algorithms=["HS256"])
        user = await db.user.find_one({"_id": payload.get("sub")})
        if user is None:
            raise credentials_exception
        if user["admin"] is False:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception


async def getUser(id: str):
    user = await db.user.find_one({"_id": id})
    if user:
        return user


async def isTokenValid(x_token: str = Header("X-Token")):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(x_token, os.environ["SECRET_KEY"], algorithms=["HS256"])
        user = await db.user.find_one({"_id": payload.get("sub")})
        if user is None:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception
