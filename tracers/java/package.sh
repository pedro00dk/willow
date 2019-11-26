command=$1

case $command in
    build)
        javac -cp src/:lib/* --add-exports jdk.jdi/com.sun.tools.jdi=ALL-UNNAMED -d out/ src/Main.java
        ;;
    start)
        shift
#        (java -cp out/:lib/* --add-exports jdk.jdi/com.sun.tools.jdi=ALL-UNNAMED Main "$@" 3>&1 1>&2 2>&3 | grep -iv 'picked') 3>&1 1>&2 2>&3
        java -cp out/:lib/* --add-exports jdk.jdi/com.sun.tools.jdi=ALL-UNNAMED Main "$@"
        ;;
    *)
        echo 'command not found'
        ;;
esac
