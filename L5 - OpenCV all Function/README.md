# 🖼️ OpenCV Python Comprehensive Tutorial

[![OpenCV](https://img.shields.io/badge/OpenCV-v4.x-green?logo=opencv&logoColor=white)](https://opencv.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python&logoColor=white)](https://www.python.org/)
[![GeeksforGeeks](https://img.shields.io/badge/Source-GeeksforGeeks-brightgreen)](https://www.geeksforgeeks.org/opencv-python-tutorial/)

A complete, high-quality collection of OpenCV Python scripts and tutorials extracted from the **GeeksforGeeks OpenCV Tutorial Hub**. This repository serves as a one-stop-shop for learning computer vision, from basic image manipulation to advanced object detection and video analysis.

---

## 🚀 Key Features

This project includes a comprehensive Jupyter Notebook (`OpenCV_Full_Tutorial.ipynb`) containing every code block from the tutorial series, categorized for easy learning.

### 📸 Image Processing foundations
- **Core Operations:** Reading, writing, displaying, and resizing images.
- **Transformations:** Translation, rotation, and color space conversions (BGR to Gray, HSV, etc.).
- **Arithmetic & Bitwise:** Image blending, addition, subtraction, AND, OR, XOR, and NOT operations.
- **Enhancement:** Blurring (Gaussian, Median, Bilateral), Thresholding (Simple, Adaptive, Otsu), and Morphological operations (Erosion, Dilation).

### 📹 Video & Motion Analysis
- **Basic Ops:** Loading videos, frame extraction, and playing video in reverse.
- **Effects:** Creating slow-motion clips and blending multiple videos.
- **Metadata:** Drawing timestamps and text on live video feeds.

### 🔍 Advanced Computer Vision
- **Feature Detection:** Line/Circle detection (Hough Transform), SIFT, and ORB.
- **Object Detection:** Face detection using Haarcascades and object tracking.
- **Analysis:** Contour detection, histogram analysis, and intensity transformations.

---

## 🛠️ Installation & Setup

To run the tutorials effectively, ensure you have a Python environment set up with the necessary libraries.

### 1. Clone the environment
```bash
# Ensure you are in your project directory
cd "Open CV"
```

### 2. Install Dependencies
```bash
pip install opencv-python numpy matplotlib
```

### 3. Launch the Tutorial
```bash
jupyter notebook OpenCV_Full_Tutorial.ipynb
```

---

## 📂 Project Structure

| File | Description |
| :--- | :--- |
| `OpenCV_Full_Tutorial.ipynb` | **The Main Masterpiece.** All-in-one notebook with interactive code. |
| `OpenCV_Tutorial.ipynb` | Quick-start version with fundamental operations. |
| `README.md` | This attractive guide. |

---

## 💡 Usage Tips

- **Image Placeholders:** Many scripts use filenames like `geeks.png` or `star.jpg`. Ensure you have an image in the directory or update the string in the code cell to your local file path.
- **Camera Access:** For video tutorials that use your webcam, ensure no other application is using the camera.
- **Interactive Windows:** When `cv2.imshow()` creates a window, press `0` (or the specified key) to close and continue to the next cell.

---

## 🌟 Acknowledgments

All code and educational content belongs to **[GeeksforGeeks](https://www.geeksforgeeks.org/)**. This repository is a organized compilation for personal learning and quick reference.

---
<p align="center">
  Made with ❤️ for Computer Vision Enthusiasts
</p>
