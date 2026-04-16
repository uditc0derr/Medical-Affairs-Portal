memory_store = {}


def get_memory(hcp_id):
    return memory_store.get(hcp_id, [])


def add_memory(hcp_id, user_input, ai_output):
    if hcp_id not in memory_store:
        memory_store[hcp_id] = []

    memory_store[hcp_id].append({
        "user": user_input,
        "ai": ai_output
    })

    # 🔥 Keep last 5 interactions only
    memory_store[hcp_id] = memory_store[hcp_id][-5:]