import fitz  # PyMuPDF
from typing import Optional


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from a PDF file using PyMuPDF."""
    try:
        doc = fitz.open(pdf_path)
        text_parts = []

        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            page_text = page.get_text("text")
            if page_text.strip():
                text_parts.append(f"--- Page {page_num + 1} ---\n{page_text}")

        doc.close()
        return "\n\n".join(text_parts).strip()
    except Exception as e:
        raise RuntimeError(f"PDF extraction failed: {str(e)}")


def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """Extract text from PDF bytes."""
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text_parts = []

        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            page_text = page.get_text("text")
            if page_text.strip():
                text_parts.append(f"--- Page {page_num + 1} ---\n{page_text}")

        doc.close()
        return "\n\n".join(text_parts).strip()
    except Exception as e:
        raise RuntimeError(f"PDF extraction from bytes failed: {str(e)}")


def get_pdf_info(pdf_path: str) -> dict:
    """Get basic PDF metadata."""
    try:
        doc = fitz.open(pdf_path)
        info = {
            "page_count": len(doc),
            "metadata": doc.metadata,
        }
        doc.close()
        return info
    except Exception as e:
        return {"page_count": 0, "metadata": {}}
