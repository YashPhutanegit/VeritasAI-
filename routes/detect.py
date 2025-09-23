from flask import Blueprint, request, jsonify

detect_bp = Blueprint('detect', __name__)

@detect_bp.route('/detect', methods=['POST'])
def detect():
    data = request.get_json()
    input_text = data.get("text", "")
    
    # Simulated hallucination detection logic
    if "fake" in input_text.lower():
        result = {"hallucination": True, "reason": "Contains 'fake'"}
    else:
        result = {"hallucination": False, "reason": "No hallucination detected"}

    return jsonify(result)
