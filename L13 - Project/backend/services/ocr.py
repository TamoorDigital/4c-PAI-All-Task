import cv2
import pytesseract
import numpy as np
from PIL import Image
import io


def preprocess_image(image_path: str) -> np.ndarray:
    """Apply OpenCV preprocessing to improve OCR accuracy."""
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image: {image_path}")

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Denoise
    denoised = cv2.fastNlMeansDenoising(gray, h=10)

    # Adaptive thresholding for better text extraction
    thresh = cv2.adaptiveThreshold(
        denoised, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11, 2
    )

    # Dilation to connect text components
    kernel = np.ones((1, 1), np.uint8)
    processed = cv2.dilate(thresh, kernel, iterations=1)

    return processed


def extract_text_from_image(image_path: str) -> str:
    """Extract text from image using OCR."""
    try:
        processed = preprocess_image(image_path)

        # Custom config for better results
        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(processed, config=custom_config)

        return text.strip()
    except Exception as e:
        raise RuntimeError(f"OCR extraction failed: {str(e)}")


def extract_text_from_image_bytes(image_bytes: bytes) -> str:
    """Extract text from image bytes."""
    try:
        image = Image.open(io.BytesIO(image_bytes))
        img_array = np.array(image)

        if len(img_array.shape) == 3:
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        else:
            gray = img_array

        denoised = cv2.fastNlMeansDenoising(gray, h=10)
        thresh = cv2.adaptiveThreshold(
            denoised, 255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            11, 2
        )

        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(thresh, config=custom_config)
        return text.strip()
    except Exception as e:
        raise RuntimeError(f"OCR extraction from bytes failed: {str(e)}")
