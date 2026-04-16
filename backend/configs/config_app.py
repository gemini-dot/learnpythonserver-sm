import redis
from datetime import timedelta
import os

redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
pool = redis.ConnectionPool.from_url(
    redis_url, max_connections=50, socket_connect_timeout=5, retry_on_timeout=True
)


class Config:
    SESSION_TYPE = "redis"
    SESSION_PERMANENT = True
    SESSION_USE_SIGNER = True
    SESSION_REDIS = redis.Redis(connection_pool=pool)
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)

    # Compression config
    COMPRESS_REGISTER = True
    COMPRESS_ALGORITHM = ["gzip", "deflate"]
