from config.redis import redis_client

try:
    # Test Write
    redis_client.set("ai:test_key", "Hello from NexusCart AI!")
    
    # Test Read
    val = redis_client.get("ai:test_key")
    print("Fetched Value:", val)
    
    # Cleanup Test Key
    redis_client.delete("ai:test_key")
    print("🟢 Redis verification complete!")
except Exception as e:
    print("🔴 Test Failed:", str(e))