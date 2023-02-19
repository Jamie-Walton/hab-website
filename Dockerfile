FROM python:3.9
ENV PYTHONUNBUFFERED=1
WORKDIR /hab-website
COPY requirements.txt /hab-website/
RUN pip3 install --upgrade pip setuptools wheel
RUN pip install -r requirements.txt
COPY . .
