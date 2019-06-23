command=$1

case $command in
    start)
        shift
        python ./src/main.py "$@"
        ;;
    *)
        echo 'command not found'
        ;;
esac
