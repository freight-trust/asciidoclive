#!/bin/bash
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#                           Copyright 2016 Chuan Ji                           #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


docker_tag="r.chu4n.com/amoya"

set -ex

docker pull $docker_tag
docker rm -f amoya || true
docker run \
  -d \
  --restart=always \
  -p 127.0.0.1:9002:80 \
  --name amoya \
  $docker_tag
