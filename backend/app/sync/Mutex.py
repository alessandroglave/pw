from time import sleep

from app.configs.Redis import get_redis
from app.exceptions import concurrent_exception


class Mutex:
    def __init__(
        self,
        lock_name: str,
        timeout=6000,  # ms
        retry=30,  # retry times
        retry_delay=200,  # ms
    ):
        self._redis = get_redis()
        self.lock_name = lock_name
        self.timeout = timeout
        self.acquired = False
        self.retry = retry
        self.retry_delay = retry_delay

    # Method used to acquire the lock, containing the retry logic
    def acquire(self):
        if self.retry == 0:
            self.lock = self._redis.set(self.lock_name, 1, nx=True, ex=self.timeout)
            if self.lock is not None:
                print("Mutex: Lock obtained")
                return True
            return False

        # Retry section
        # It tries to acquire a lock self.retry times each self.retry_delay milliseconds
        for attempt in range(self.retry):
            self.lock = self._redis.set(self.lock_name, 1, nx=True, ex=self.timeout)
            print(f"Mutex: {attempt + 1} attempt to acquire the lock:", self.lock)
            if self.lock is not None:
                print("Mutex: Lock obtained")
                return True
            else:
                print(
                    f"Mutex: Lock not obtained, {'exiting' if attempt + 1 == self.retry else f'retrying in {self.retry_delay}ms'}"
                )
            sleep(
                self.retry_delay
                / 1000.0  # It converts the retry delay from milliseconds to seconds used by the sleep function as argument
            )

        return False

    # Method used to release the lock.
    # It's important to always release the lock once finished,
    # also in case of errors, to make it available again.
    def release(self):
        print("releasing lock")
        try:
            if not self.lock:
                print("No lock to release.")
            # deletes the record from Redis
            self._redis.delete(self.lock_name)
            self.lock = None
        except:
            pass

    """
        __enter__ and __exit__ special methods are defined to let
        the Mutex class to be used with Python's Context Manager Pattern.
        This way, its not required to call acquire and release methods manualy.
        To use it, just write: 
            with Mutex(lock_name) as mutex:
                if mutext.lock:
                    # critical section

        __enter__ method is called automatically on "with Mutex(lock_name) as mutex".
        
        __exit__ method is called automatically when the block exits,
        regardless of whether it finishes normally or with an exception.
    """

    def __enter__(self):
        self.acquire()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if self.lock:
            self.release()
        else:
            raise concurrent_exception()
