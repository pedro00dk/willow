# Deploy script

USERNAME=${1}
TOKEN=${2}
REPOSITORY=${3}
AUTHENTICATION_CLIENT_ID=${4}
AUTHENTICATION_CLIENT_SECRET=${5}

set -v

# stop and remove any running containers
docker container ls --all
docker container stop $(docker container ls --quiet) || true
docker container rm $(docker container ls --all --quiet) || true


# pull github build images
docker login --username ${USERNAME} --password ${TOKEN} docker.pkg.github.com
docker image pull docker.pkg.github.com/${REPOSITORY}/willow-tracer-java
docker image pull docker.pkg.github.com/${REPOSITORY}/willow-tracer-python
docker image pull docker.pkg.github.com/${REPOSITORY}/willow-server
docker image pull docker.pkg.github.com/${REPOSITORY}/willow-client
docker image prune --force

# start services
docker network create willow-network || true

# start api server
JAVA_TRACER_COMMAND="docker run --rm -i docker.pkg.github.com/${REPOSITORY}/willow-tracer-java --silent"
PYTHON_TRACER_COMMAND="docker run --rm -i docker.pkg.github.com/${REPOSITORY}/willow-tracer-python --silent"

docker container run --name willow-server \
    --rm --detach --network willow-network --volume /var/run/docker.sock:/var/run/docker.sock \
    docker.pkg.github.com/${REPOSITORY}/willow-server \
    -- \
    --port 8000 \
    --tracer-command python "${PYTHON_TRACER_COMMAND}" \
    --tracer-command java "${JAVA_TRACER_COMMAND}" \
    --tracer-steps 500 \
    --signed-steps 1000 \
    --authentication-enable \
    --authentication-client-id "${AUTHENTICATION_CLIENT_ID}" \
    --authentication-client-secret "${AUTHENTICATION_CLIENT_SECRET}"


sudo docker container run --name willow-client \
    --rm --detach --network willow-network --publish 80:8000 \
    --env 'PORT=8000' \
    --env 'SERVER=http://willow-server:8000' \
    --env 'PROXY=yes' \
    docker.pkg.github.com/${REPOSITORY}/willow-client
