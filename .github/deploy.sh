# Deploy script

USERNAME=$1
TOKEN=$2
REPOSITORY=$3

set -v

# kill and remove any running containers
docker container ls --all
docker container kill $(docker container ls --quiet) || true
docker container rm $(docker container ls --all --quiet) || true


# pull github build images
docker login --username ${USERNAME} --password ${TOKEN} docker.pkg.github.com
docker image pull docker.pkg.github.com/${REPOSITORY}/willow-tracer-java
docker image pull docker.pkg.github.com/${REPOSITORY}/willow-tracer-python
docker image pull docker.pkg.github.com/${REPOSITORY}/willow-server
docker image pull docker.pkg.github.com/${REPOSITORY}/willow-client

# clean dangling images
docker image prune --force

# start api server
JAVA_TRACER_COMMAND="docker run --rm -i docker.pkg.github.com/${REPOSITORY}/willow-tracer-java --silent"
PYTHON_TRACER_COMMAND="docker run --rm -i docker.pkg.github.com/${REPOSITORY}/willow-tracer-python --silent"

docker container run --rm --detach --network host --volume /var/run/docker.sock:/var/run/docker.sock \
    docker.pkg.github.com/${REPOSITORY}/willow-server \
    -- \
    --port 8000 \
    --tracer python "${PYTHON_TRACER_COMMAND}" \
    --tracer java "${JAVA_TRACER_COMMAND}"

# start client static files server
docker container run --rm --detach --network host \
    --env 'PORT=80' \
    --env 'SERVER=http://localhost:8000' \
    --env 'PROXY=yes' \
    docker.pkg.github.com/${REPOSITORY}/willow-client \
