build:
	javac -cp src/:lib/* --add-exports jdk.jdi/com.sun.tools.jdi=ALL-UNNAMED -d out/ src/Main.java

run: ./out/Main.class
	java -cp out/:lib/* --add-exports jdk.jdi/com.sun.tools.jdi=ALL-UNNAMED Main ${ARGS}

run-suppress-trash:
	(java -cp out/:lib/* --add-exports jdk.jdi/com.sun.tools.jdi=ALL-UNNAMED Main ${ARGS} 3>&1 1>&2 2>&3 | grep -iv 'picked') 3>&1 1>&2 2>&3
