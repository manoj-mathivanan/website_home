"""Grounded, deterministic resume assistant. No model credentials or API charges required."""
import json
import re
from pathlib import Path

KNOWLEDGE = json.loads((Path(__file__).parent / 'knowledge.json').read_text(encoding='utf-8'))
FACTS = KNOWLEDGE['facts']
STOP = set('a an and are as at be can could do does for from has have his how i in is it me my of on or please tell that the their this to was what when where which who with would you your about'.split())
REFUSAL = 'I can answer questions about Manoj’s public career information and projects only. I don’t have verified information for that question. You can ask about his experience, skills, education, innovations, or Trader, or leave your contact details for Manoj.'

def tokens(text):
    return set(re.findall(r'[a-z0-9]+', text.lower())) - STOP

def answer(question, previous_question=''):
    lower = question.lower().strip()
    if re.fullmatch(r'(hi|hello|hey|thanks|thank you)[!. ]*', lower):
        return {'text': 'Hello! Ask me about Manoj’s experience, skills, education, or projects. Career details are from his February 2024 resume.', 'sources': []}
    # These requests cannot become general-purpose instructions, even when they mention Manoj.
    if re.search(r'ignore|system prompt|previous instructions|roleplay|act as|write (?:a |an )?(?:poem|essay|code)|investment advice|buy stocks|password|secret|other (?:chat|conversation)|salary|wife|children|married|date of birth', lower):
        return {'text': REFUSAL, 'sources': []}
    wanted = tokens(question)
    if not wanted or wanted <= {'manoj', 'mathivanan', 'background', 'introduce', 'summary'}:
        chosen = [FACTS[0]]
    else:
        if lower in ('more', 'tell me more', 'more details', 'go on', 'and more'):
            wanted = tokens(previous_question)
        scores = []
        for fact in FACTS:
            keys = tokens(fact['keywords'])
            score = len(wanted & keys)
            # Specific names should outrank incidental occurrences in a general summary.
            score += 4 * len(wanted & tokens(fact['title']))
            if score:
                scores.append((score, fact))
        scores.sort(key=lambda item: item[0], reverse=True)
        if not scores:
            return {'text': REFUSAL, 'sources': []}
        chosen = [fact for score, fact in scores[:3] if score >= max(1, scores[0][0] / 2)]
    return {
        'text': '\n\n'.join(fact['text'] for fact in chosen),
        'sources': [{'title': fact['title'], 'url': fact['url']} for fact in chosen]
    }
