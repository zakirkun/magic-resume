from pydantic import BaseModel
from typing import Dict, List, Union

class ResponseSchema(BaseModel):
    message: str = "success"
    result: List[Union[str, Dict[str, str], List[Union[str, Dict[str, str]]]]] | List[str] = []
    object: List[str] = []