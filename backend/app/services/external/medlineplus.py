"""MedlinePlus health topics (U.S. National Library of Medicine). Free, no API key.

Docs: https://medlineplus.gov/about/developers/webservices/
Limit: 85 requests per minute per IP, so results are cached in memory.
"""

import html
import re
import xml.etree.ElementTree as ET
from dataclasses import dataclass

import httpx

URL = "https://wsearch.nlm.nih.gov/ws/query"

_cache: dict[str, "Topic | None"] = {}


@dataclass
class Topic:
    title: str
    url: str
    summary: str  # plain text, paragraphs and list items on their own lines


def _to_text(markup: str) -> str:
    """The summary is HTML with search-highlight spans; keep the words and line breaks."""
    text = re.sub(r"</?(p|li|ul|ol|h\d)[^>]*>", "\n", markup)
    text = re.sub(r"<[^>]+>", "", text)
    text = html.unescape(text)
    lines = [re.sub(r"\s+", " ", line).strip() for line in text.split("\n")]
    return "\n".join(line for line in lines if line)


async def find_topic(condition: str) -> Topic | None:
    """Best-matching health topic for a condition name, or None if there isn't one."""
    key = condition.strip().lower()
    if key in _cache:
        return _cache[key]

    params = {"db": "healthTopics", "term": key, "retmax": 1}
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(URL, params=params)
        r.raise_for_status()

    doc = ET.fromstring(r.content).find("./list/document")
    topic = None
    if doc is not None:
        fields: dict[str, list[str]] = {}
        for content in doc.findall("content"):
            fields.setdefault(content.get("name", ""), []).append(_to_text(content.text or ""))
        title = (fields.get("title") or [""])[0]
        summary = (fields.get("FullSummary") or [""])[0]
        # altTitle is skipped: it lists related topics too (e.g. scarlet fever), not just synonyms
        if title and summary:
            topic = Topic(title=title, url=doc.get("url", ""), summary=summary)

    _cache[key] = topic
    return topic
