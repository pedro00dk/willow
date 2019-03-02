command=$1

case $command in
    build)
        (javac -cp src/:lib/* --add-exports jdk.jdi/com.sun.tools.jdi=ALL-UNNAMED -d out/ src/Main.java 3>&1 1>&2 2>&3 | grep -iv -E 'note|picked' | cat) 3>&1 1>&2 2>&3
        ;;
    test)
        echo 'no tests implemented yet'
        ;;
    start)
        shift
        (java -cp out/:lib/* --add-exports jdk.jdi/com.sun.tools.jdi=ALL-UNNAMED Main "$@" 3>&1 1>&2 2>&3 | grep -iv 'picked') 3>&1 1>&2 2>&3
        ;;
    *)
        echo 'command not found'
        ;;
esac
