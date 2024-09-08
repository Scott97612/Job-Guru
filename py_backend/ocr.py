import cv2
import pytesseract

def img2text(image_path):
    image = cv2.imread(image_path)
    # Convert the image to RGB (OpenCV loads images in BGR format)
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    return pytesseract.image_to_string(rgb_image)
