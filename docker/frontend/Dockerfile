FROM node:20
WORKDIR /app/frontend
RUN apt-get update && \
    apt-get install -y git vim && \
    rm -rf /var/lib/apt/lists/*
USER node
