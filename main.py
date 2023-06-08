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
def create_memo(memo:Memo):
  memos.append(memo)
  return '200 ok'


app.mount('/', StaticFiles(directory='static', html=True), name='index');