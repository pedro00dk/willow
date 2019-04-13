command=$1

case $command in
    build)
        (javac -cp src/:lib/* --add-exports jdk.jdi/com.sun.tools.jdi=ALL-UNNAMED -d out/ src/Main.java 3>&1 1>&2 2>&3 | grep -iv -E 'note|picked' | cat) 3>&1 1>&2 2>&3
        ;;
    protobuf)
        mkdir -p ./src/protobuf && protoc --java_out=./src/protobuf --proto_path=../../protobuf/ ../../protobuf/*.proto
        # fix missing packages
        sed -i '1s/^/package protobuf;\n/' -- ./src/protobuf/*.java
        ;;
    start)
        shift
        (java -cp out/:lib/* --add-exports jdk.jdi/com.sun.tools.jdi=ALL-UNNAMED Main "$@" 3>&1 1>&2 2>&3 | grep -iv 'picked') 3>&1 1>&2 2>&3
        ;;
    *)
        echo 'command not found'
        ;;
esac
