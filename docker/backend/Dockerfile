FROM node:20
WORKDIR /app/backend
RUN apt-get update && \
    apt-get install -y git vim && \
    rm -rf /var/lib/apt/lists/*
USER node
EXPOSE 4000
