prompt_extract = \
"""
Act as Linguistic who has expertise on Skill and Knowledge. Extract Skill and Knowledge from the given text maximum 2 words only.

text: {text}

Generate the result with List of Array separate with comma without additional description or 'Here is the result:' or 'Based on the given text', or 'I extracted the skills and knowledge as follows', use the following format,
result: [skill a, skill b]
"""
prompt_missing_skill = \
    """
Act as Linguistic who has expertise on Skill and Knowledge. Analyze missing Skill thats required or similar Skill for improve the career, given suggest following. 

text: {text}

Generate the result with List of Array separate with comma without additional description or 'I analyzed the skills and knowledge:' or 'following missing skills and similar skills that can improve his career' or 'Based on the provided text' or 'here is the result:', use the following format,
result: [skill a, skill b]

    """
prompt_course_suggest = \
    """
Act as Linguistic who has expertise on Skill and Knowledge. Suggest keyword with detail title for course or tutorial for improve the career path based on skill or releted the skill the following.

Skill: {text}

Generate the result with List of Array separate with comma without additional description or 'here is the result:', use the following format,
result: [skill a, skill b]

    """