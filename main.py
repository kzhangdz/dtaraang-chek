import easyocr
import os
from pathlib import Path

image_paths = []
for dirpath, dirnames, filenames in os.walk("Images"):
    for filename in filenames:
        path = os.path.join(dirpath, filename)
        image_paths.append(path)

reader = easyocr.Reader(['th','en'])

for path in image_paths:
    print(path)
    result = reader.readtext(path)
    print(result)
