FROM ubuntu:latest

RUN apt update \
    && apt install --y curl gnupg2 libltdl7 lsb-release \
    # node and npm
    && curl -fsSL -o ./node_setup.sh https://deb.nodesource.com/setup_11.x \
    && sh ./node_setup.sh \
    && apt install -y nodejs \
    # docker (only cli, bind mount host domain socket)
    && curl -fsSL -o docker_cli_only.deb https://download.docker.com/linux/ubuntu/dists/$(lsb_release -cs)/pool/stable/$(dpkg --print-architecture)/docker-ce-cli_18.09.1~3-0~ubuntu-bionic_amd64.deb \
    && dpkg -i ./docker_cli_only.deb \
    #
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ADD ./package.json ./

RUN npm install

ADD ./src ./src
ADD ./test ./test
ADD ./tsconfig.json ./

ENTRYPOINT [ "npm", "run", "start" ]
CMD [ "--", "--help" ]