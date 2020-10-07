import uvicorn

from fastapi import FastAPI, Request, File, UploadFile, Body
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from fastai.vision.all import *

import os
import pathlib
import asyncio
import base64
import numpy as np
from PIL import Image
from io import BytesIO

app = FastAPI()

try:
    path = Path(__file__).parent
except:
    path = Path(r'C:\\Users\\sayank\\workspace\\mnist-fastapi\\')

model_name = 'mnist_resnet18_2.pkl'

app.mount("/static", StaticFiles(directory="static"), name="static")

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory="templates")

class CanvasImg(BaseModel):
    canvasimg: str

def load_posix_learner(path):
    save = pathlib.PosixPath
    pathlib.PosixPath = pathlib.WindowsPath
    
    learn = load_learner(path)
    
    pathlib.PosixPath = save
    return learn

async def setup_learner():
    try:
        print(path/model_name)
        try:
            learn = load_learner(path/model_name)
        except:
            learn = load_posix_learner(path/model_name)
        learn.dls.device = 'cpu'
        print("Loaded model")
        return learn
    except RuntimeError as e:
        if len(e.args) > 0 and 'CPU-only machine' in e.args[0]:
            print(e)
            message = "\n\nThis model was trained with an old version of fastai and will not work in a CPU environment.\n\nPlease update the fastai library in your training environment and export your model again.\n\nSee instructions for 'Returning to work' at https://course.fast.ai."
            raise RuntimeError(message)
        else:
            raise

learn = None
@app.on_event("startup")
async def startup_event():
    """Setup the learner on server start"""
    global learn
    loop = asyncio.get_event_loop()  # get event loop
    tasks = [asyncio.ensure_future(setup_learner())]  # assign some task
    learn = (await asyncio.gather(*tasks))[0]  # get tasks

@app.post("/upload")
async def create_file(req: CanvasImg):
    try:
        canvasimg = req.canvasimg.replace('data:image/png;base64,', '')
        canvasimg = canvasimg.replace(' ', '+')
        canvasimg = base64.b64decode(canvasimg)
        img = Image.open(BytesIO(canvasimg)).convert('RGB')
        np_img = np.array(img)
        preds = learn.predict(np_img)
    except:
        print("Prediction Failed")
    return {"pred": preds[0]}

@app.get("/", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/cron")
async def cron_func():
    return {"alive": True}
