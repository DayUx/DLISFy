from fastapi import FastAPI, Depends

from . import dependencies
from .internal import admin
from .routers import auth, music

app = FastAPI()
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



@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
