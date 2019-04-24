# Deploy script
# This script requires git, docker and some gnu tools

set -ev

# kill and remove any running containers
docker container ls --all
docker container kill $(docker container ls --quiet) || true
docker container rm $(docker container ls --all --quiet) || true

# clone project
rm -fr ./willow/ || true
git clone https://github.com/pedro00dk/willow
cd ./willow/

# create or update images
cd ./tracers/java/
docker image build --tag willow:java .
cd ../python/
docker image build --tag willow:python .
cd ../../server/
docker image build --tag willow:server .
cd ../client/
docker image build --tag willow:client .

# clean dangling images
docker image prune --force

# start api server
docker container run --name willow_server --rm --detach \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    -- \
    willow:server \
    -- \
    --tracer java 'docker run --rm -i willow:java --in-mode proto' \
    --tracer python 'docker run --rm -i willow:python --in-mode proto'

# give some time to the container to start
SERVER_IP=$(docker container inspect willow_server --format {{.NetworkSettings.IPAddress}})
echo $SERVER_IP

# start client server
sudo docker container run --name willow_client --rm --detach --publish 80:8000 \
    --env 'PORT=8000' \
    --env "SERVER=http://${SERVER_IP}:8000" \
    --env 'PROXY=yes' \
    -- \
    willow:client