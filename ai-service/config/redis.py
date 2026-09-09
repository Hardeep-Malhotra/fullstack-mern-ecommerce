import os
import redis
from dotenv import load_dotenv

load_dotenv()

# Redis Configuration from Environment Variables
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD") or None

# Connect to Redis with decode_responses=True (automatic UTF-8 string conversion)
redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    password=REDIS_PASSWORD,
    decode_responses=True
)

try:
    if redis_client.ping():
        print("🟢 Redis connected successfully in AI-Service!")
except Exception as error:
    print("🔴 Redis connection failed in AI-Service:", str(error))