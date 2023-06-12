from fastapi import FastAPI, UploadFile, Form, Response;
from fastapi.staticfiles import StaticFiles;
from fastapi.responses import JSONResponse;
from fastapi.encoders import jsonable_encoder;
from pydantic import BaseModel;
from typing import Annotated;
import sqlite3;

con = sqlite3.connect('database.db', check_same_thread=False);
cur = con.cursor();

app = FastAPI();

class Memo(BaseModel):
  id: int
  content: str
  image: str

memos = []

@app.get('/memo')
def get_memo():
  con.row_factory = sqlite3.Row;
  cur = con.cursor();
  rows = cur.execute(f"""SELECT * FROM memos""").fetchall();
  return JSONResponse(jsonable_encoder(dict(row) for row in rows));

@app.post('/memo/create')
async def create_memo(
  title: Annotated[str, Form()],
  content: Annotated[str, Form()],
  image: UploadFile
  ):
  
  image_bytes = await image.read();
  cur.execute(f"""
              INSERT INTO memos(contents, image, title)
              VALUES('{content}','{image_bytes.hex()}','{title}')
              """)
  con.commit();
  return '200'

@app.get('/images/{memo_id}')
def get_image(memo_id):
  cur = con.cursor();
  img_byte = cur.execute(f"""SELECT image FROM memos WHERE id={memo_id}""").fetchone()[0];
  return Response(content=bytes.fromhex(img_byte));

@app.put('/memo/{id}')
def update_memo(data:Memo):
  for memo in memos: 
    if memo.id == data.id:
      memo.content = data.content
      return '성공'
  return '메모가 없습니다.'

@app.delete('/memo/{id}')
def delete_memo(id):
  for index, memo in enumerate(memos): 
    if memo.id == int(id):
      memos.pop(index)
      return '성공'
  return '메모가 없습니다.'



app.mount('/', StaticFiles(directory='static', html=True), name='index');