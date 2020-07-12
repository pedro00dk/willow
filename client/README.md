# Willow Client

Willow front-end implementation.
Contains the source that generates client bundle and a couple of scripts to help serving it.
The client itself is just a bundle of files; so, there is no command line interface implemented in the client as in the api.
Therefore options are passed through environment variables when building or serving (parcel - dotenv).

### Environment Variables

-   `FIREBASE_WEBAPP_CONFIGURATION`: This variable must hold the contents of the firebase webapp configuration file.
    (do not confuse with `GOOGLE_APPLICATION_CREDENTIALS`, with has the path to the service account key file, not even used by the client)
-   `FIRESTORE_EMULATOR`: Override the `FIREBASE_WEBAPP_CONFIGURATION` option that contains the firestore address.
    This allows the use of a local firestore emulator for testing purposes.
    If not used, this variable must be set to the `false` string.
