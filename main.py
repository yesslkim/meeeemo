from fastapi import FastAPI;
from fastapi.staticfiles import StaticFiles;
from pydantic import BaseModel;

app = FastAPI();

class Memo(BaseModel):
  id: int
  content: str

memos = []

@app.get('/memo')
def get_memo():
  return memos

@app.post('/memo/create')
def create_memo(data:Memo):
  memos.append(data)
  return '200 ok'

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