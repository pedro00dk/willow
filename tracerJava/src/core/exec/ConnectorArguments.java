package core.exec;


/**
 * Virtual machine connector arguments.
 */
enum ConnectorArguments {
    HOME("home"),
    OPTIONS("options"),
    MAIN("main"),
    SUSPEND("suspend"),
    QUOTE("quote"),
    EXEC("vmexec"),
    CWD("cwd"),
    ENV("env"),
    HOSTNAME("hostname"),
    PORT("port"),
    TIMEOUT("timeout");

    final String arg;

    ConnectorArguments(String arg) {
        this.arg = arg;
    }
}
