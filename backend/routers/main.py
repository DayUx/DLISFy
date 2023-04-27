from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import dependencies
from backend.routers.private import admin
from backend.routers.public import music, stream, auth
from dotenv import load_dotenv,find_dotenv
load_dotenv(find_dotenv())
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(
    admin.router,
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(dependencies.isAdmin)],
    responses={418: {"description": "I'm a teapot"}},
)
app.include_router(
    auth.router,
    prefix="/auth",
    tags=["auth"],
    responses={418: {"description": "I'm a teapot"}},
)
app.include_router(
    music.router,
    prefix="/music",
    tags=["app"],
    dependencies=[Depends(dependencies.isTokenValid)],
    responses={418: {"description": "I'm a teapot"}},
)
app.include_router(
    stream.router,
    prefix="/stream",
    tags=["app"],
    # dependencies=[Depends(dependencies.isTokenValid)],
    responses={418: {"description": "I'm a teapot"}},
)



@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
