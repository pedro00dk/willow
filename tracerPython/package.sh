command=$1

case $command in
    setup)
        python -m venv .venv
        ;;
    activate)
        source ./.venv/bin/activate
        ;;
    install)
        shift
        if [ "$#" -eq "0" ]
        then
            ./.venv/bin/pip install --requirement ./requirements.txt
        else
            packages="$@"
            ./.venv/bin/pip install "$packages"
            for package in $packages
            do
                if [ -z $(grep $package ./requirements.txt) ]
                then
                    echo $package >> ./requirements.txt
                fi
            done
        fi
        ;;
    protobuf)
        mkdir --parent ./src/protobuf && protoc --python_out=./src/protobuf --proto_path=../protobuf/ ../protobuf/*
        # fix import paths of other proto modules
        sed --in-place --regexp-extended "s/(import .*_pb2 as .*_pb2)/from . \1/g" -- ./src/protobuf/*_pb2.py
        ;;
    start)
        shift
        ./.venv/bin/python ./src/main.py "$@"
        ;;
    *)
        echo "missing script: $command"
        ;;
esac
