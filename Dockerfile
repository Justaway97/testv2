FROM python:3.11.0a3-alpine3.15

WORKDIR /app

COPY requirements.txt /app/requirements.txt

# Configure server
RUN set -ex \
    && pip install --upgrade pip \
    && apk add --virtual build-essential gcc python3-dev musl-dev \
    && apk add postgresql-dev \
    && apk add jpeg-dev zlib-dev \
    && pip install psycopg2 \
    && pip install --no-cache-dir -r /app/requirements.txt

# copy source to destination (in the docker container)
ADD . .

# port
# EXPOSE 8000

# CMD ["gunicorn", "--bind", ":8000", "--workers", "3", "core.wsgi:application"]

CMD gunicorn core.wsgi:application --bind 0.0.0.0:$PORT
