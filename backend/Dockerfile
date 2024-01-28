# Use the official Python image as the base image
FROM python:3.9-slim-buster

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the working directory
COPY requirements.txt .

RUN apt update
# Dependency for opencv-python (cv2). `import cv2` raises ImportError: libGL.so.1: cannot open shared object file: No such file or directory
# Solution from https://askubuntu.com/a/1015744
RUN apt install -y libgl1-mesa-glx tesseract-ocr libtesseract-dev

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Flask application code to the working directory
COPY . .

# Expose the port on which the Flask app will run
EXPOSE 8000

# Set the entry point for the container
# CMD ["gunicorn", "src.app:app"]
# Set the entry point for the container
# CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "src.main:app"]
CMD ["python","/app/src/main.py"]

