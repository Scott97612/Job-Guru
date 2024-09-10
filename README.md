# Job Guru

Helps you write CV/Resume and Cover Letter with LLMs based on materials user provided such as personal profile, job descriptions, company, and other tailored user requests.

## What it looks like (Demo video)

[![Demo](https://drive.google.com/uc?export=download&id=1ZWudt4dGl3UcPH00ppbw2TOe6b7Fd9-b)](https://www.youtube.com/watch?v=W23KJC85ki8)

## How to use

This app uses tesseract for image2text extraction. In order to use this feature, you have to first install tesseract to use screenshot as input. If you don't use screenshot as input, no need to install it, the app should work without issues.

For MacOs, better use Homebrew: `brew install tesseract`

For Ubuntu: `sudo apt install tesseract-ocr`

For Windows: check here https://tesseract-ocr.github.io/tessdoc/Downloads.html

`cd py_backend`

`pip install -r requirements.txt`

`python server.py`

To run the backend Python Flask server.

---

`cd Job-Guru`

`npm install`

`npm run dev`

To run the frontend React app.

---

Feel free to alter the sys_instruction.txt to improve the LLM inference results.
