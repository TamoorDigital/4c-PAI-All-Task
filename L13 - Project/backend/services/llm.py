import json
import re
import time
from groq import Groq
from config import GROQ_API_KEY

# Groq uses OpenAI-compatible SDK
client = Groq(api_key=GROQ_API_KEY)


# Model priority list — Groq free tier models, fastest first
MODELS_TO_TRY = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
]

MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 5


def _call_groq(prompt: str) -> str:
    """
    Try each Groq model in order with retries.
    Handles 429 rate limit by waiting and retrying.
    """
    last_error = None

    for model_name in MODELS_TO_TRY:
        for attempt in range(MAX_RETRIES):
            try:
                response = client.chat.completions.create(
                    model=model_name,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.7,
                    max_tokens=8192,
                )
                return response.choices[0].message.content

            except Exception as e:
                error_str = str(e)
                last_error = e

                # 429 rate limit
                if "429" in error_str or "rate_limit" in error_str.lower() or "too many requests" in error_str.lower():
                    retry_match = re.search(r'try again in (\d+\.?\d*)s', error_str, re.IGNORECASE)
                    wait = float(retry_match.group(1)) if retry_match else RETRY_DELAY_SECONDS
                    wait = min(wait, 60)

                    if attempt < MAX_RETRIES - 1:
                        print(f"[LLM] Rate limit on {model_name}, waiting {wait}s (attempt {attempt+1}/{MAX_RETRIES})")
                        time.sleep(wait)
                        continue
                    else:
                        print(f"[LLM] Exhausted retries on {model_name}, trying next model...")
                        break

                # Daily quota exhausted
                elif "quota" in error_str.lower() or "exceeded" in error_str.lower():
                    print(f"[LLM] Quota exceeded for {model_name}, trying next model...")
                    break

                # Model not found / deprecated
                elif "model" in error_str.lower() and ("not found" in error_str.lower() or "does not exist" in error_str.lower()):
                    print(f"[LLM] Model {model_name} not available, trying next...")
                    break

                # Other errors — retry once
                else:
                    if attempt < MAX_RETRIES - 1:
                        time.sleep(2)
                        continue
                    break

    raise RuntimeError(
        f"All Groq models failed. Last error: {str(last_error)}\n\n"
        f"Possible causes:\n"
        f"1. Free tier daily/minute quota exhausted — wait a minute and retry\n"
        f"2. API key issue — check GROQ_API_KEY in your .env file\n"
        f"3. Get your free key at: https://console.groq.com"
    )


def generate_mcq(text: str, count: int, difficulty: str = "important") -> list[dict]:
    difficulty_map = {
        "basic":     "beginner-level, factual recall",
        "important": "intermediate-level, conceptual understanding",
        "exam":      "advanced-level, analytical and application-based",
    }
    diff_desc = difficulty_map.get(difficulty, "intermediate-level")

    prompt = f"""You are an expert educator. Based on the following study material, generate exactly {count} high-quality multiple choice questions (MCQs).

Requirements:
- Difficulty: {diff_desc}
- Each MCQ must have exactly 4 options labeled A, B, C, D
- Clearly indicate the correct answer
- Provide a brief explanation for the correct answer
- Avoid duplicate questions
- Questions must be directly based on the provided text
- Return ONLY a valid JSON array, no extra text, no markdown fences

Output format (strict JSON array):
[
  {{
    "question": "Question text here?",
    "options": {{
      "A": "Option A text",
      "B": "Option B text",
      "C": "Option C text",
      "D": "Option D text"
    }},
    "answer": "A",
    "explanation": "Brief explanation why A is correct"
  }}
]

Study Material:
{text}

Generate exactly {count} MCQs now:"""

    raw = _call_groq(prompt)
    return _parse_json_response(raw, "mcq")


def generate_short(text: str, count: int) -> list[dict]:
    prompt = f"""You are an expert educator. Based on the following study material, generate exactly {count} short answer questions.

Requirements:
- Questions should test key concepts from the material
- Each answer should be 2-4 sentences
- Avoid duplicate questions
- Return ONLY a valid JSON array, no extra text, no markdown fences

Output format (strict JSON array):
[
  {{
    "question": "Short answer question here?",
    "answer": "Concise 2-4 sentence answer here."
  }}
]

Study Material:
{text}

Generate exactly {count} short answer questions now:"""

    raw = _call_groq(prompt)
    return _parse_json_response(raw, "short")


def generate_long(text: str, count: int) -> list[dict]:
    prompt = f"""You are an expert educator. Based on the following study material, generate exactly {count} detailed long-answer questions.

Requirements:
- Questions should require in-depth explanation
- Each answer should be comprehensive (150-300 words)
- Include key points that should be covered
- Avoid duplicate questions
- Return ONLY a valid JSON array, no extra text, no markdown fences

Output format (strict JSON array):
[
  {{
    "question": "Long answer question here?",
    "answer": "Comprehensive detailed answer here...",
    "key_points": ["Key point 1", "Key point 2", "Key point 3"]
  }}
]

Study Material:
{text}

Generate exactly {count} long answer questions now:"""

    raw = _call_groq(prompt)
    return _parse_json_response(raw, "long")


def _parse_json_response(raw: str, gen_type: str) -> list[dict]:
    """Extract and parse JSON array from Groq response."""
    cleaned = re.sub(r'```(?:json)?\s*', '', raw)
    cleaned = re.sub(r'```\s*$', '', cleaned).strip()

    start = cleaned.find('[')
    end   = cleaned.rfind(']') + 1
    if start == -1 or end == 0:
        raise ValueError(f"No JSON array found in response for {gen_type}. Raw: {raw[:300]}")

    json_str = cleaned[start:end]
    try:
        data = json.loads(json_str)
        if not isinstance(data, list):
            raise ValueError("Expected a JSON array")
        return data
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON: {e}\nRaw: {raw[:500]}")