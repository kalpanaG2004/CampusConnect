# Converts MongoDB _id (Object_Id) to id (string) as per schema and removes _id for Pydantic compatibility.
def serialize_fb(fb: dict) -> dict:
    fb["id"] = str(fb["_id"])
    del fb["_id"]
    return fb
