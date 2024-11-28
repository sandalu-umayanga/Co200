import cv2
import numpy as np
import os
from skimage.filters import frangi

def sub_process(path):
    def ImageEnhancer(image):
        abs_image_path = os.path.abspath(image)
        print(f"Using absolute image path: {abs_image_path}")

        artery_image = cv2.imread(abs_image_path, cv2.IMREAD_GRAYSCALE)
        if artery_image is None:
            print(f"Error: Unable to load image at {abs_image_path}. Check the file path.")
            return

        # Image Processing
        artery_image_equalized = cv2.equalizeHist(artery_image)
        denoised_image = cv2.fastNlMeansDenoising(artery_image, None, h=10, templateWindowSize=7, searchWindowSize=21)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        clahe_image = clahe.apply(artery_image)
        frangi_image = (frangi(artery_image) * 255).astype(np.uint8)

        # Directory Handling
        save_path = os.getcwd()
        processed_images_dir = os.path.join(save_path, "media", "processed_images")
        if not os.path.exists(processed_images_dir):
            os.makedirs(processed_images_dir)

        # Save Processed Images
        cv2.imwrite(os.path.join(processed_images_dir, "1.jpg"), artery_image_equalized)
        cv2.imwrite(os.path.join(processed_images_dir, "2.jpg"), denoised_image)
        cv2.imwrite(os.path.join(processed_images_dir, "3.jpg"), clahe_image)
        cv2.imwrite(os.path.join(processed_images_dir, "4.jpg"), frangi_image)

    # Convert relative path to absolute path
    current_directory = os.getcwd()
    image = os.path.join(current_directory, path)
    ImageEnhancer(image)
