# Suppose that you’d like to implement a cookie jar in which to store cookies. In a file called jar.py, implement a class called Jar with these methods:
class Jar:
    # __init__ should initialize a cookie jar with the given capacity, which represents the maximum number of cookies that can fit in the cookie jar. If capacity is not a non-negative int, though, __init__ should instead raise a ValueError (via raise ValueError).
    def __init__(self, capacity=12):
        if capacity < 0:
            raise ValueError("Capacity issues")
        self.capacity = capacity
        self.size = 0

    #  __str__ should return a str with n 🍪, where n is the number of cookies in the cookie jar. For instance, if there are 3 cookies in the cookie jar, then str should return "🍪🍪🍪"
    def __str__(self):
        return "🍪" * self.size

    # deposit should add n cookies to the cookie jar. If adding that many would exceed the cookie jar’s capacity, though, deposit should instead raise a ValueError.
    def deposit(self, n):
        self.size = self.size + n
        if self.size > self.capacity:
            raise ValueError("Cookies capacity exceeded")

    # withdraw should remove n cookies from the cookie jar. Nom nom nom. If there aren’t that many cookies in the cookie jar, though, withdraw should instead raise a ValueError.
    def withdraw(self, n):
        self.size = self.size - n
        if self.size < 0:
            raise ValueError("Attempt to withdraw more than in jar")

    # capacity should return the cookie jar’s capacity.
    @property
    def capacity(self):
        return self._capacity

    @capacity.setter
    def capacity(self, capacity):
        if type(capacity) != int and capacity <= 0:
            raise ValueError("Negative capacity of the Jar")
        self._capacity = capacity

    # size should return the number of cookies actually in the cookie jar.
    @property
    def size(self):
        return self._size

    @size.setter
    def size(self, size):
        if size < 0:
            raise ValueError("Attempt to withdraw more cookies than left in jar ")
        self._size = size

# Main function for Class tests


def main():
    jar = Jar()
    print((jar.capacity))
    jar.deposit(1)
    print(str(jar.size))
    jar.withdraw(0)
    print(str(jar.size))
    print(str(jar))


if __name__ == "__main__":
    main()