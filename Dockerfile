FROM fastdotai/fastai:latest

RUN apt-get update && apt-get install -y git python3-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade -r requirements.txt

COPY . .

# RUN python app/server.py

EXPOSE 8000

CMD ["python", "main.py", "serve"]