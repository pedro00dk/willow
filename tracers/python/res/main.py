# test code

b = True
i = 1234
f = 123.4
c = 1.2 + 3.4j
s = 'qwer'

tt = (b, i, f)
ll = [i, f, c]
ss = {f, c, s}
dd = {
    'b': True,
    'i': 1234,
    'f': 123.4,
    'c': 1.2 + 3.4j,
    's': 'qwer'
}


class CCC:
    def __init__(self):
        self.attribute = False


ccc = CCC
cci = CCC()

print(b, i, f, c, s)
print(tt, ll, ss, dd, sep='\n')
print(ccc, cci, sep='\n')

iii = input('input: ')
print(iii)


def fib(i):
    return i if i <= 1 else fib(i - 1) + fib(i - 2)


fff = fib(4)


def deep_exception(i):
    if (i < 1):
        raise Exception('some exception')
    deep_exception(i - 1)


try:
    deep_exception(4)
except Exception as e:
    print(str(e))
