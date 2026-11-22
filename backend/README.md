# ML Layer

Symptoms → ranked conditions (LightGBM) → plain-language explanation (Claude).

Run from `backend/`:

```bash
python -m ml_layer.train_model   # once per machine (model file is gitignored)
python -m ml_layer.llm           # demo run (needs ANTHROPIC_API_KEY in the repo-root .env)
pytest
```

## Where things are

| Function | File | What it does |
|---|---|---|
| `chain_of_thought(demographics, symptoms)` | `llm.py` | **Main entry point.** Runs the full pipeline, returns explanation + predictions |
| `summarize_questionnaire(demographics)` | `llm.py` | Intake form → text summary for the prompt |
| `explain_diagnosis(summary, symptoms, predictions)` | `llm.py` | Calls Claude; prompt rules are in `SYSTEM_PROMPT` |
| `top_k_predictions(symptoms, k)` | `model.py` | Symptoms → top k `ConditionScore`s |
| `load_model()` | `model.py` | Loads the saved model (once) |
| `build_symptom_row(symptoms, columns)` | `model.py` | Symptom names → model input row |
| `load_dataset()` | `data.py` | Loads + cleans `data/dataset.csv` |
| `augment_with_dropout(x, y)` | `augment.py` | Adds partial-symptom training copies |

Settings (paths, LightGBM parameters, seed) are in `config.py`.
Shared data types (`Demographic`, `Symptom`, `ConditionScore`) are in `backend/shared/`.