#!/bin/bash

SHA=$(git rev-parse HEAD)

docker build -t kosamtech/multi-client:latest ./client
docker build -t kosamtech/multi-server:latest ./server
docker build -t kosamtech/multi-worker:latest ./worker
docker build -t kosamtech/multi-worker:nginx ./nginx

docker push kosamtech/multi-client:latest
docker push kosamtech/multi-server:latest
docker push kosamtech/multi-worker:latest
docker push kosamtech/multi-nginx:latest