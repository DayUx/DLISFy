from __future__ import annotations

import os
from datetime import datetime, timedelta

from fastapi import APIRouter, status, HTTPException
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from backend.model.Style import StyleModel
import motor.motor_asyncio
from dotenv import load_dotenv
from jose import JWTError, jwt

load_dotenv()

router = APIRouter()
client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv("MONGODB_URL"))
db = client.dlisfy
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class Login(BaseModel):
    username: str
    password: str


class Register(BaseModel):
    username: str
    password: str
    email: str


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expires_delta = timedelta(minutes=float(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))
    return encoded_jwt


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(login: Login):
    user = await db.user.find_one({"username": login.username})
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if verify_password(login.password, user["password"]) is False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")
    access_token = create_access_token(data={"sub": user["_id"]})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(register: Register):
    try:
        user = await db.user.find_one({"username": register.username})
        if user is not None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
        hashed_password = pwd_context.hash(register.password)
        user = await db.user.insert_one(
            {"username": register.username, "password": hashed_password, "email": register.email})
        access_token = create_access_token(data={"sub": user["_id"]})
        return {"access_token": access_token, "token_type": "bearer"}
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not registered")
