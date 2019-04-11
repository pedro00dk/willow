command=$1

case $command in
    build)
        rm -r ./.venv
        python -m venv ./.venv
        ./.venv/bin/pip install -r ./requirements.txt
        ;;
    protobuf)
        mkdir -p ./src/protobuf && protoc --python_out=./src/protobuf --proto_path=../protobuf/ ../protobuf/*.proto
        # fix import paths of other proto modules
        sed -i -r 's/(import .*_pb2 as .*_pb2)/from . \1/g' -- ./src/protobuf/*_pb2.py
        ;;
    start)
        shift
        ./.venv/bin/python ./src/main.py "$@"
        ;;
    *)
        echo 'command not found'
        ;;
esac
