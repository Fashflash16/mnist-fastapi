FROM fastdotai/fastai:latest

RUN apt-get update && apt-get install -y git python3-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade -r requirements.txt

COPY . .

RUN adduser myuser
USER myuser

CMD uvicorn main:app --host 0.0.0.0 --port $PORT