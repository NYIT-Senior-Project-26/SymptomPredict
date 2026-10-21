import json
import pandas as pd
import os
from dotenv import load_dotenv
from enum import Enum
import anthropic
from src import predict_models

# This is where the Two-Step CoT process will occur. The idea is that there
# will be one / two calls necessary that then branch out to other functions
# to compose an output for the user

load_dotenv() 
client = anthropic.Anthropic(
    api_key=os.getenv('ANTHROPIC_API_KEY')
)

# For testing, use 'claude-haiku-5-5'. Explore alternatives and Spring 26 research for prod model
global_model = 'claude-haiku-5-5'
global_max_tokens = 1000

class Symptom:
    def __init__(self, name: str, severity: int):
        self.name = name
        self.severity = severity    # 1 -> 10; least to worst severe
        # This can be added later
        # self.duration = duration

        @property
        def severity(self) -> int:
            return self._severity

        @severity.setter
        def severity(self, value: int) -> None:
            if not (10 >= value >= 1):
                raise ValueError(f'Severity value out of bounds [1,5]: {value}')
            self._severity = value

class Sex(Enum):
    MALE = "male"
    FEMALE = "female"

# Figure out if any other fields would be useful here
class Demographic:
    def __init__(self, age: int, sex: Sex, weight: float):
        self.age = age
        self.sex = sex
        self.weight = weight    # This is in pounds
        # Going to have to add allergies, existing conditions, medications

    def to_dict(self):
        demo_dict = {}
        demo_dict.update({'age': self.age})
        demo_dict.update({'sex': self.sex.value})
        demo_dict.update({'weight (lbs)': self.weight})

        return demo_dict

    # Property setters for sex
    @property
    def sex(self) -> Sex:
        return self._sex

    @sex.setter
    def sex(self, value: Sex) -> None:
        if not isinstance(value, Sex):
            raise ValueError(f"Sex must be an instance of {Sex.__name__}")
        self._sex = value

    # Property setters for age
    @property
    def age(self) -> int:
        return self._age

    @age.setter
    def age(self, value: int) -> None:
        # Can change this range easily
        if not (5 <= value <= 80):
            raise ValueError(f"Age must be within bounds [5, 80], recieved: {value}")
        self._age = value

    # Weight kept in pounds
    # Property setters for weight
    @property
    def weight(self) -> float:
        return self._weight

    @weight.setter
    def weight(self, value: float) -> None:
        # Can change this range easily
        if not (35 <= value <= 350):
            raise ValueError(f"Weight must be within bounds [35, 350], recieved: {value}")
        self._weight = value

# LLM pipeline
# Questionnaire summary
def summarize_questionnaire(questions: Demographic) -> str:
    prompt1 = """
        You are an experienced medical assistant tasked with summarizing the current patient's demographic information, aiming to understand it
        thoroughly and help provide additional context about the user. Categorize and summarize the following demographic information for the user
        into the specified categories. Use concise bullet points for each category, ensuring all critical information is captured. If a category has
        no relevant information, simply write 'No information provided.' Categories: age, sex, weight.
    """
    
    output = client.messages.create(
        model=global_model,
        max_tokens=global_max_tokens,
        messages=[
            {
                "role": "user",
                "content": f"{prompt1} \n{questions.to_dict()}",
            }
        ],
    )
    return output.content[0].text

# Full scope explaination
def explain_diagnosis(summary, symptons, predictions):
    # This is where the LLM would be fully utilized
    pass

def chain_of_thought(demographics: Demographic, symptoms: list[Symptom]):
    # Process layout:
    # First Step:
    #   User demographics questionnaire goes straight to LLM prompt 1 for structured summary
    # Second Step:
    #   Symptoms gets turned into a (x,0) dataframe
    #   Symptoms goes out to print_top_k_prediction_xxx functions
    # Third Step:
    #   Outputs from step one and two are brought to the LLM to give a structured Natural Language output
    # Fourth Step:
    #   Symptoms are also given as output for easy use in frontend or anywhere else that needs the raw data without LLM output

    # First step
    # User demographics
    step1_out = summarize_questionnaire(demographics)

    # Second step
    # Turn symptoms into a dataframe
    
    top_k = ""# predict_models.top_k_prediction_rf()

    # Third step


    pass

if __name__ == "__main__":
    demo = Demographic(30, Sex.MALE, 140)
    print(demo.to_dict())

    symptoms = [
        Symptom('acne', 2),
        Symptom('cold', 4),
    ]

    # summary = summarize_questionnaire(demo)
    # print(summary)