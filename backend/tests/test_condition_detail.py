import httpx
from fastapi.testclient import TestClient

from app.main import app
from app.prediction import condition_detail as cd
from app.schemas.condition import ConditionDetail
from app.services.external import medlineplus

client = TestClient(app)

SAMPLE_XML = b"""<?xml version="1.0" encoding="UTF-8"?>
<nlmSearchResult><list num="1" start="0" per="1">
  <document rank="0" url="https://medlineplus.gov/streptococcalinfections.html">
    <content name="title">&lt;span class="qt0"&gt;Streptococcal&lt;/span&gt; Infections</content>
    <content name="altTitle">&lt;span class="qt0"&gt;Strep&lt;/span&gt; Throat</content>
    <content name="altTitle">Streptococcal Infections</content>
    <content name="FullSummary">What is it?&lt;p&gt;A &amp;amp; B bacteria.&lt;/p&gt;&lt;ul&gt;&lt;li&gt;Sore throat&lt;/li&gt;&lt;/ul&gt;</content>
  </document>
</list></nlmSearchResult>"""


def _empty_detail(**changes) -> ConditionDetail:
    fields = dict(
        overview="", symptoms=[], symptoms_note="", how_common=[], how_common_note="",
        risk_factors=[], tests=[], treatment="", treatment_points=[], allergy_warning="",
        at_home_care=[], timeline=[], timeline_note="", get_help=[],
    )
    return ConditionDetail(**{**fields, **changes})


def test_medlineplus_parses_and_strips_markup(monkeypatch):
    async def fake_get(self, url, params=None):
        return httpx.Response(200, content=SAMPLE_XML, request=httpx.Request("GET", url))

    monkeypatch.setattr(httpx.AsyncClient, "get", fake_get)
    medlineplus._cache.clear()
    import asyncio

    topic = asyncio.run(medlineplus.find_topic("Strep throat"))
    assert topic.title == "Streptococcal Infections"
    assert topic.url == "https://medlineplus.gov/streptococcalinfections.html"
    assert topic.summary == "What is it?\nA & B bacteria.\nSore throat"


def test_detail_endpoint_returns_sections_and_source(monkeypatch):
    async def fake_topic(name):
        return medlineplus.Topic(title="Strep", url="https://medlineplus.gov/x.html", summary="text")

    seen = {}

    async def fake_claude(system, content, schema):
        seen.update(content)
        return _empty_detail(overview="A throat infection.")

    monkeypatch.setattr(medlineplus, "find_topic", fake_topic)
    monkeypatch.setattr(cd, "structured_call", fake_claude)
    r = client.post("/api/v1/conditions/detail", json={"name": "Strep throat", "reported": ["Fever"], "allergies": ["Penicillin"]})

    assert r.status_code == 200
    body = r.json()
    assert body["overview"] == "A throat infection."
    assert body["source_url"] == "https://medlineplus.gov/x.html"
    assert seen["source_text"] == "text" and seen["patient_allergies"] == ["Penicillin"]


def test_detail_endpoint_404_without_source(monkeypatch):
    async def no_topic(name):
        return None

    monkeypatch.setattr(medlineplus, "find_topic", no_topic)
    r = client.post("/api/v1/conditions/detail", json={"name": "Made-up condition"})
    assert r.status_code == 404
