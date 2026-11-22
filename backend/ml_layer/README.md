# ML Layer: Getting Started

Ranks likely conditions from reported symptoms (LightGBM, 41 diseases, 132 symptoms),
then has Claude explain the ranking in plain language.

## 1. Set up (once)

Already followed the Backend steps in the root README? Skip to step 2.
Otherwise, from the repo root (`SymptomPredict/`), with Python 3.13:

```bash
python3 -m venv .venv
source .venv/bin/activate                  # Windows: .venv\Scripts\activate
pip install -r requirements.txt -r backend/requirements.txt
cp .env.example .env                       # then set ANTHROPIC_API_KEY
```

**Run every command below from `backend/`**, using `python -m`:

```bash
cd backend
```

## 2. Train the model

```bash
python -m ml_layer.train_model
```

Expect `CV accuracy (full profiles): mean=0.990` and
`Saved model to .../backend/models/lgbm_model.pkl`.
The model file is gitignored, so **every machine has to run this once**, and again
after anything in `ml_layer/` changes how the model is trained.

## 3. Run it

```bash
python -m ml_layer.llm      # demo: itching + skin rash -> ranking + Claude's explanation
pytest                      # all tests
```

Use it from code:

```python
from ml_layer.model import top_k_predictions
from ml_layer.llm import chain_of_thought
from shared import Demographic, Symptom

top_k_predictions(["itching", "skin rash"])          # -> [ConditionScore(name=..., probability=...), ...]
chain_of_thought(demographic, [Symptom(name="itching", severity=7)])
```

Symptom names are normalized for you ("Skin Rash" → `skin_rash`), but must exist in the
dataset; `python -m ml_layer.inspect_data` shows the data.

## What's where

| File | Purpose |
|---|---|
| `config.py` | Paths, LightGBM settings, seed: change settings here |
| `data.py` | Loads and cleans `data/dataset.csv` (used everywhere) |
| `augment.py` | Symptom-dropout augmentation so the model handles 1–3 symptoms |
| `model.py` | Loads the saved model; `top_k_predictions()` |
| `llm.py` | Intake summary → model ranking → Claude explanation |
| `train_model.py` | Trains and saves the production model |
| `compare_models.py` | Compares LightGBM against RF/XGBoost baselines on partial input → `results/` |
| `inspect_data.py` | Data-quality report |
| `../shared/` | Pydantic types used across the backend (`Demographic`, `Symptom`, `ConditionScore`, …) |

## Troubleshooting

| Problem | Fix |
|---|---|
| `No trained model at .../lgbm_model.pkl` | Run step 2 |
| Many tests **skipped** | Same: the model-based tests skip until step 2 |
| `ModuleNotFoundError: ml_layer` or `shared` | You're not in `backend/`, or ran `python ml_layer/x.py` instead of `python -m ml_layer.x` |
| `Unknown symptom '...'` | Name isn't a dataset column; check spelling against `inspect_data` |
| Claude auth error | `ANTHROPIC_API_KEY` missing from the repo-root `.env` |
