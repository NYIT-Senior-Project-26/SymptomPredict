"""Matches what the user reported to the symptoms the ML model was trained on
(the column names in ml_layer/data/dataset.csv, e.g. `skin_rash`).

Reported symptoms with no match are returned as `unmatched`, so Claude knows
which symptoms the model never saw. Follow-up answers only add model symptoms;
the rest of each answer already reaches Claude through `notes`.

Like the intake questions, these mappings need review by someone with clinical knowledge.
"""

from dataclasses import dataclass, field

from shared import normalize_symptom_name

# Symptom chips from the app (frontend/src/intake/content.ts), lowercased → dataset symptoms
SYMPTOM_KEYS: dict[str, list[str]] = {
    "fever": ["high_fever"],
    "headache": ["headache"],
    "cough": ["cough"],
    "sore throat": ["throat_irritation"],
    "painful swallowing": ["throat_irritation"],
    "stomach pain": ["stomach_pain"],
    "rash": ["skin_rash"],
    "fatigue": ["fatigue"],
    "dizziness": ["dizziness"],
    "congestion": ["congestion"],
    "swollen glands": ["swelled_lymph_nodes"],
    "stiff neck": ["stiff_neck"],
    "chest pain": ["chest_pain"],
    "shortness of breath": ["breathlessness"],
    "racing heartbeat": ["fast_heart_rate"],
    "nausea": ["nausea"],
    "vomiting": ["vomiting"],
    "diarrhea": ["diarrhoea"],
    "bloating": ["distention_of_abdomen"],
    "back pain": ["back_pain"],
    "lower back pain": ["back_pain"],
    "muscle stiffness": ["movement_stiffness"],
    "pain when urinating": ["burning_micturition"],
    "joint pain": ["joint_pain"],
    "muscle pain": ["muscle_pain"],
    "weakness": ["muscle_weakness"],
}

# Follow-up question id → answer option → dataset symptoms
# (ids and options from frontend/src/intake/content.ts and bodyAreaQuestions.ts)
ANSWER_KEYS: dict[str, dict[str, list[str]]] = {
    "fever": {"Yes": ["high_fever"]},
    "head-neck": {"Yes": ["stiff_neck"]},
    "head-vision": {
        "Blurred or double vision": ["blurred_and_distorted_vision"],
        "Flashing lights or zigzag lines": ["visual_disturbances"],
    },
    "tn-cold": {
        "Runny or stuffy nose": ["runny_nose", "congestion"],
        "Cough": ["cough"],
        "Sneezing": ["continuous_sneezing"],
    },
    "tn-lump": {
        "Yes, and it is tender": ["swelled_lymph_nodes"],
        "Yes, but it isn't tender": ["swelled_lymph_nodes"],
    },
    "ch-with": {
        "Sweating": ["sweating"],
        "Nausea": ["nausea"],
        "Shortness of breath": ["breathlessness"],
    },
    "ch-food": {"Yes": ["acidity"]},
    "ab-bowel": {
        "Diarrhea": ["diarrhoea"],
        "Constipation": ["constipation"],
        "Blood, or black and tarry stool": ["bloody_stool"],
    },
    "ab-vomit": {"Yes": ["vomiting"], "I feel sick but haven’t vomited": ["nausea"]},
    "ab-vomit-blood": {"Yes": ["stomach_bleeding"]},
    "ab-urine": {"Yes": ["burning_micturition"]},
    "lb-urine": {"Yes": ["burning_micturition"]},
    "lb-weakness": {"Yes": ["weakness_in_limbs"]},
    "lg-where": {"Hip": ["hip_joint_pain"], "Knee": ["knee_pain"]},
}


@dataclass
class SymptomMatch:
    keys: list[str] = field(default_factory=list)  # dataset symptoms, no duplicates
    matched: list[str] = field(default_factory=list)  # reported symptoms the model can use
    unmatched: list[str] = field(default_factory=list)  # reported symptoms the model never sees


def match_symptoms(
    symptoms: list[str], follow_up_answers: dict[str, list[str]], known: set[str]
) -> SymptomMatch:
    """`known` is the model's symptom vocabulary; keys outside it are never returned."""
    result = SymptomMatch()
    keys: dict[str, None] = {}  # ordered set

    for symptom in symptoms:
        text = symptom.strip()
        if not text:
            continue
        # A chip label, or a dataset name typed directly ("skin rash" → skin_rash)
        found = [
            k
            for k in SYMPTOM_KEYS.get(text.lower(), [normalize_symptom_name(text)])
            if k in known
        ]
        if found:
            result.matched.append(text)
            keys.update(dict.fromkeys(found))
        else:
            result.unmatched.append(text)

    for question_id, answers in follow_up_answers.items():
        options = ANSWER_KEYS.get(question_id, {})
        for answer in answers:
            keys.update(dict.fromkeys(k for k in options.get(answer, []) if k in known))

    result.keys = list(keys)
    return result
