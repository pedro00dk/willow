FROM python:alpine

WORKDIR /app
ADD ./src ./src

ENTRYPOINT ["python", "-OO", "./src/main.py"]
CMD ["--help"]