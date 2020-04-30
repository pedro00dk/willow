# Deploy servers script

GITHUB_USERNAME=${1}
GITHUB_PASSWORD=${2}
GITHUB_REPOSITORY=${3}
API_AUTH_CLIENT_ID=${4}
API_AUTH_CLIENT_SECRET=${5}
API_DB_URL=${6}
API_PORT=${7}
CLIENT_API=${8}
CLIENT_PORT=${9}

set -v

docker container ls --all
docker container stop $(docker container ls --quiet) || true
docker container rm $(docker container ls --all --quiet) || true
docker login --username ${GITHUB_USERNAME} --password ${GITHUB_PASSWORD} docker.pkg.github.com
docker image pull docker.pkg.github.com/${GITHUB_REPOSITORY}/willow-api
docker image pull docker.pkg.github.com/${GITHUB_REPOSITORY}/willow-client
docker image pull docker.pkg.github.com/${GITHUB_REPOSITORY}/willow-tracer-java
docker image pull docker.pkg.github.com/${GITHUB_REPOSITORY}/willow-tracer-python
docker image prune --force

docker network create willow-network || true

JAVA_TRACER="docker run --rm -i docker.pkg.github.com/${GITHUB_REPOSITORY}/willow-tracer-java --silent"
PYTHON_TRACER="docker run --rm -i docker.pkg.github.com/${GITHUB_REPOSITORY}/willow-tracer-python --silent"

sudo docker container run --name willow-api \
    --rm --detach --network willow-network --publish "${API_PORT}:8000" \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    docker.pkg.github.com/${GITHUB_REPOSITORY}/willow-api \
    -- \
    --tracer python "${PYTHON_TRACER}" \
    --tracer java "${JAVA_TRACER}" \
    --steps 200 \
    --timeout 5000 \
    --auth-steps 1000 \
    --auth-timeout 10000 \
    --auth \
    --auth-client-id "${API_AUTH_CLIENT_ID}" \
    --auth-client-secret "${API_AUTH_CLIENT_SECRET}" \
    --db \
    --db-url "${API_DB_URL}" \
    --db-name willow \
    --port 8000

sudo docker container run --name willow-client \
    --rm --detach --network willow-network --publish "${CLIENT_PORT}:8000" \
    --env "API=${CLIENT_API}" \
    --env 'PORT=8000' \
    docker.pkg.github.com/${GITHUB_REPOSITORY}/willow-client
