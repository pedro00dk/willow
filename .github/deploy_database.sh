DATABASE_USER=${1}
DATABASE_PASSWORD=${2}
DATABASE_DIRECTORY=${3}
DATABASE_PORT=${4}

set -v

docker container ls --all
docker stop mongo-database || true
docker rm mongo-database || true
docker pull mongo

mkdir --parents "${DATABASE_DIRECTORY}"
echo "
db = db.getSiblingDB('admin')
db.createUser({ user: '${DATABASE_USER}', pwd: '${DATABASE_PASSWORD}', roles: ['root'] })
" |
sudo tee "${DATABASE_DIRECTORY}/createDatabaseAdmin.js"

docker container run \
    --name mongo-noauth \
    --rm --detach --publish ${DATABASE_PORT}:27017 --volume ${DATABASE_DIRECTORY}:/data/db/ \
    mongo \
    mongod

sleep 5

docker container exec \
    --interactive --tty \
    mongo-noauth \
    mongo /data/db/createDatabaseAdmin.js

docker stop mongo-noauth

docker container run \
    --name mongo-database \
    --rm --detach --publish ${DATABASE_PORT}:27017 --volume ${DATABASE_DIRECTORY}:/data/db/ \
    mongo \
    mongod --auth
