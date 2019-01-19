FROM ubuntu:latest

RUN apt update \
    && apt install --yes -- curl gnupg2 libltdl7 lsb-release \
    # node and npm
    && curl --fail --silent --show-error --location --output ./node_setup.sh -- https://deb.nodesource.com/setup_11.x \
    && sh -- ./node_setup.sh \
    && apt install --yes -- nodejs \
    # docker (only cli, bind mount host domain socket)
    && curl --fail --silent --show-error --location --output docker_cli_only.deb -- https://download.docker.com/linux/ubuntu/dists/$(lsb_release -cs)/pool/stable/$(dpkg --print-architecture)/docker-ce-cli_18.09.1~3-0~ubuntu-bionic_amd64.deb \
    && dpkg --install -- ./docker_cli_only.deb \
    #
    && rm --force --recursive -- /var/lib/apt/lists/*

WORKDIR /app
ADD ./package.json ./

RUN npm install

ADD ./src ./src
ADD ./tsconfig.json ./

ENTRYPOINT [ "npm", "run-script", "start" ]
CMD [ "--", "--help" ]