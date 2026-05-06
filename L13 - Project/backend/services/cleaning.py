import re
from typing import Optional


def clean_text(text: str) -> str:
    """Clean and normalize extracted text for LLM processing."""
    if not text:
        return ""

    # Remove null bytes
    text = text.replace('\x00', '')

    # Normalize unicode whitespace
    text = re.sub(r'[\u00a0\u2000-\u200f\u2028\u2029\ufeff]', ' ', text)

    # Remove control characters except newlines and tabs
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)

    # Remove repeated special characters (e.g., ---- or ====)
    text = re.sub(r'([^\w\s])\1{3,}', r'\1', text)

    # Collapse multiple blank lines to max 2
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Collapse multiple spaces to one
    text = re.sub(r'[ \t]{2,}', ' ', text)

    # Remove lines that are just whitespace or punctuation
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped and not re.match(r'^[\W_]+$', stripped):
            cleaned_lines.append(stripped)
        elif stripped == '':
            cleaned_lines.append('')

    text = '\n'.join(cleaned_lines)

    # Final strip
    text = text.strip()

    return text


def truncate_text(text: str, max_chars: int = 12000) -> str:
    """Truncate text to max_chars for LLM context safety."""
    if len(text) <= max_chars:
        return text
    return text[:max_chars] + "\n\n[... text truncated for processing ...]"


def extract_keywords(text: str, max_keywords: int = 20) -> list[str]:
    """Simple keyword extraction using regex."""
    words = re.findall(r'\b[A-Za-z][a-z]{3,}\b', text)
    word_freq: dict[str, int] = {}
    for word in words:
        word_lower = word.lower()
        word_freq[word_lower] = word_freq.get(word_lower, 0) + 1

    sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
    stopwords = {
        'this', 'that', 'with', 'from', 'they', 'have', 'been', 'will',
        'your', 'which', 'when', 'their', 'there', 'these', 'would', 'could',
        'should', 'about', 'more', 'also', 'into', 'than', 'then', 'each'
    }
    keywords = [w for w, _ in sorted_words if w not in stopwords]
    return keywords[:max_keywords]
