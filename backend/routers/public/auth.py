from __future__ import annotations

import os
from datetime import datetime, timedelta

import motor.motor_asyncio
from fastapi import APIRouter, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from backend.model.User import UserModel

MONGO_URL=os.getenv("MONGO_URL") or "mongodb://localhost:27017"
SECRET_KEY=os.getenv("SECRET_KEY") or "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM=os.getenv("ALGORITHM") or "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES") or 1440

router = APIRouter()
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
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
    expires_delta = timedelta(minutes=float(ACCESS_TOKEN_EXPIRE_MINUTES))
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login", status_code=status.HTTP_200_OK)
async def login(login: Login):
    user = await db.user.find_one({"username": login.username})
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur non trouvé")
    if verify_password(login.password, user["password"]) is False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Mot de passe incorrect")
    access_token = create_access_token(data={"sub": str(user["_id"])})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(register: UserModel):

    user = await db.user.find_one({"email": register.email})
    if user is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email déjà utilisé")
    user = await db.user.find_one({"username": register.username})
    if user is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Pseudo déjà utilisé")
    hashed_password = pwd_context.hash(register.password)
    user = await db.user.insert_one(
        {"username": register.username, "password": hashed_password, "email": register.email, "admin": False})
    access_token = create_access_token(data={"sub": str(user.inserted_id)})
    return {"access_token": access_token, "token_type": "bearer"}
