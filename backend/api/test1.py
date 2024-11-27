from PIL import Image
import matplotlib.pyplot as plt
import numpy as np
import cv2
from skimage.filters import frangi
import os

def sub_process(path):
    def plot_images(images, titles=None, cmap='gray'):
        n = len(images)
        cols = int(np.ceil(np.sqrt(n)))
        rows = int(np.ceil(n / cols))
        
        plt.figure(figsize=(15, 10))

        for i in range(n):
            plt.subplot(rows, cols, i + 1)
            plt.imshow(images[i], cmap=cmap)
            if titles:
                plt.title(titles[i])
            plt.axis('off')

        plt.tight_layout()
        plt.show()

    def ImageEnhancer(image):
        # Convert to absolute path
        abs_image_path = os.path.abspath(image)
        print(f"Using absolute image path: {abs_image_path}")

        artery_image = cv2.imread(abs_image_path, cv2.IMREAD_GRAYSCALE)

        if artery_image is None:
            print("Error: Unable to load image. Check the file path.")
            return

        #roi = cv2.selectROI(artery_image)
        #print(roi)

        #artery_image = artery_image[int(roi[1]):int(roi[1]+roi[3]), int(roi[0]):int(roi[0]+roi[2])]

        # plotting a histogram to get an idea about the pixel values
        '''hist = cv2.calcHist([artery_image], [0], None, [256], [0, 256])
        intensity_values = np.array([x for x in range(hist.shape[0])])
        plt.bar(intensity_values, hist[:, 0], width=5)
        plt.title("Bar histogram")
        plt.show()'''

        #print(artery_image)
        gaussian_blur = cv2.GaussianBlur(artery_image, (5, 5), 0)
        


        artery_image_equalized = cv2.equalizeHist(artery_image)
        bilateral_filter = cv2.bilateralFilter(artery_image, 9, 75, 75)
        denoised_image = cv2.fastNlMeansDenoising(artery_image, None, h=10, templateWindowSize=7, searchWindowSize=21)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        clahe_image = clahe.apply(artery_image)

        # Gabor filter
        ksize = 31
        sigma = 4.0
        theta = np.pi / 4
        lamda = np.pi / 8
        gamma = 0.5
        phi = 0
        gabor_kernel = cv2.getGaborKernel((ksize, ksize), sigma, theta, lamda, gamma, phi, ktype=cv2.CV_32F)
        gabor_image = cv2.filter2D(artery_image, cv2.CV_8UC3, gabor_kernel)

        # Frangi Filter
        frangi_image = frangi(artery_image)

        # Fourier Transform
        dft = cv2.dft(np.float32(artery_image), flags=cv2.DFT_COMPLEX_OUTPUT)
        dft_shift = np.fft.fftshift(dft)
        rows, cols = artery_image.shape
        crow, ccol = rows // 2, cols // 2
        mask = np.zeros((rows, cols, 2), np.uint8)
        r = 30
        center = [crow, ccol]
        x, y = np.ogrid[:rows, :cols]
        mask_area = (x - center[0]) ** 2 + (y - center[1]) ** 2 <= r*r
        mask[mask_area] = 1

        fshift = dft_shift * mask
        f_ishift = np.fft.ifftshift(fshift)
        image_back = cv2.idft(f_ishift)
        image_back = cv2.magnitude(image_back[:, :, 0], image_back[:, :, 1])
        cv2.normalize(image_back, image_back, 0, 255, cv2.NORM_MINMAX)

        #images = [artery_image, artery_image, artery_image_equalized, denoised_image, clahe_image, frangi_image, image_back]
        #titles = ["original", "cropped", "Histogram Equalized", "Noise Cancelled", "CLAHE algorithm", "Frangi filter", "Fourier enhanced image"]
        #plot_images(images, titles)

        cv2.imwrite("D:/semester4/Co200/new/New folder/Co200/backend/media/processed_images/1.jpg", artery_image_equalized)
        cv2.imwrite("D:/semester4/Co200/new/New folder/Co200/backend/media/processed_images/2.jpg", denoised_image)
        cv2.imwrite("D:/semester4/Co200/new/New folder/Co200/backend/media/processed_images/3.jpg", clahe_image)
        cv2.imwrite("D:/semester4/Co200/new/New folder/Co200/backend/media/processed_images/4.jpg", frangi_image)

    # Update the relative path with the absolute path conversion
    image = rf"D:\semester4\Co200\new\New folder\Co200\backend\{path}"
    ImageEnhancer(image)

