# Python Tracer

A tool to inspect python code, analyzing it line by line and returning its state (stack and heap data).

```
Python tracer CLI

optional arguments:
  -h, --help            show this help message and exit
  --auto                Run without stopping
  --in-mode {proto,text}
                        The input mode
  --out-mode {json,proto,text,text1}
                        The output mode
  --test                Run the test code ignoring the provided
```

### Current protocol restrictions (missing implementation)

* Receive TracerRequest with multiple actions
* Start action tar binary support