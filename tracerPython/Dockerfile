FROM python:alpine

WORKDIR /app
ADD ./res ./res
ADD ./src ./src

ENTRYPOINT ["python", "-OO", "./src/main.py"]
CMD ["--help"]