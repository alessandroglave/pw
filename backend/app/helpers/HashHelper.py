import bcrypt


# These functions are used to hash and verify user password
def verify(plain_string: str, hashed_string: bytes):
    password_byte_enc = plain_string.encode("utf-8")
    return bcrypt.checkpw(password=password_byte_enc, hashed_password=hashed_string)


def hash(string: str):
    pwd_bytes = string.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password=pwd_bytes, salt=salt)
    return hashed_password
