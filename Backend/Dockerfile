FROM alpine:latest
RUN apk update
RUN apk add py-pip
RUN apk add --no-cache python3-dev 
RUN pip install --upgrade pip
WORKDIR /api
COPY . /api
RUN pip --no-cache-dir install -r requirements.txt
EXPOSE 5000
CMD ["python3", "backend.py"]