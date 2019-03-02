(javac -cp src/:lib/* --add-exports jdk.jdi/com.sun.tools.jdi=ALL-UNNAMED -d out/ src/Main.java 3>&1 1>&2 2>&3 | grep -iv -e 'note' -e 'picked') 3>&1 1>&2 2>&3
(java -cp out/:lib/* --add-exports jdk.jdi/com.sun.tools.jdi=ALL-UNNAMED Main "$@" 3>&1 1>&2 2>&3 | grep -iv 'picked') 3>&1 1>&2 2>&3
