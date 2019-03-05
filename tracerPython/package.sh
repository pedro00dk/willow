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
                echo $package >> ./requirements.txt
            done
        fi
        ;;
    protobuf)
        mkdir --parent ./src/protobuf && protoc --python_out=./src/protobuf --proto_path=../protobuf/ ../protobuf/*
        # fix import paths of other proto modules
        sed --in-place --regexp-extended "s/(import .+_pb2 as .+_pb2)/from . \1/" -- ./src/protobuf/*_pb2.py
        ;;
    lint)
        ./.venv/bin/flake8
        ;;
    test)
        echo "no tests implemented yet"
        ;;
    start)
        shift
        ./.venv/bin/python ./src/main.py "$@"
        ;;
    *)
        echo "command not found"
        ;;
esac
