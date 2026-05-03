from pydantic import BaseModel
from typing import List

class SkinProfile(BaseModel):
    skin_concerns: List[str]
    allergies: List[str]
