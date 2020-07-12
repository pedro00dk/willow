# Willow

![Continuous Deployment](https://github.com/pedro00dk/willow/workflows/Continuous%20Deployment/badge.svg)

Program visualizations for Algorithms and Data Structures.

Demonstration video: https://www.youtube.com/watch?v=y4KFEZGWVtA

## Usage Instructions

[Check usage instructions here](./wiki/HOW_TO_USE.md)

## Examples

Trees:
![](./wiki/images/tree.gif)

Sorting:
![](./wiki/images/sort.gif)

## Running Locally

To setup and run Willow locally, a few steps are necessary.

First, you must go start the language tracers you want to use.
Willow has currently two tracers available, one for java and another for python.
They can be executed by going into the `tracers/java` or `tracers/python` folder and running the command `make emulator`.

The java tracer (beta) requires `maven` and `java 11` or higher.
The python tracer requires `python 3.7` or higher.

After starting the tracers, you must decide if you want to start a static or development setup.

## Modules Documentation

For more information about willow, check modules documentations:

-   [Client](./client/README.md)
-   [Java Tracer](./tracers/java/README.md)
-   [Python Tracer](./tracers/python/README.md)
