# detector.py

from transformers import pipeline

# Initialize the zero-shot classification pipeline
# You can replace the model with a custom or more accurate one later
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Define labels to classify between factual and hallucinated content
candidate_labels = ["factual", "hallucinated"]

def detect_text_hallucination(text):
    """
    Detect whether the given text is factual or hallucinated.

    Args:
        text (str): The input text to classify.

    Returns:
        dict: A dictionary containing the predicted label, confidence, and full model output.
    """
    try:
        result = classifier(text, candidate_labels=candidate_labels)
        top_label = result['labels'][0]
        confidence = result['scores'][0]

        return {
            "label": top_label,
            "confidence": round(confidence * 100, 2),
            "raw_output": result
        }

    except Exception as e:
        return {
            "error": str(e)
        }
