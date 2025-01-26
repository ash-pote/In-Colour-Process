# Generated with help of chat.gpt

import os
import json
from PIL import Image
from collections import defaultdict
from colorsys import rgb_to_hls


# Function to extract hues from an image and count their occurrences
def extract_hues(image_path, min_pixel_threshold=2000):
    with Image.open(image_path) as img:
        img = img.convert("RGB")  # Ensure it's in RGB mode
        pixels = list(img.getdata())

        hue_count = defaultdict(int)  # Dictionary to count occurrences of each hue

        # Convert RGB to HSL and count the Hue occurrences
        for rgb in pixels:
            r, g, b = [value / 255.0 for value in rgb]
            h, _, _ = rgb_to_hls(r, g, b)
            hue_degrees = int(h * 360)  # Convert hue to degrees (0-360)
            hue_count[hue_degrees] += 1

        # Filter hues that occur in at least `min_pixel_threshold` pixels
        filtered_hues = {hue for hue, count in hue_count.items() if count >= min_pixel_threshold}
        return filtered_hues


# Function to scan the directory for image files
def scan_directory_for_images(directory):
    supported_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff')
    image_files = []

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(supported_extensions):
                image_files.append(os.path.join(root, file))

    print(f"Found {len(image_files)} image files in {directory}.")
    return image_files


# Function to track specific hue ranges in images
def track_hues_in_images(directory, target_hue_range, min_pixel_threshold=2000):
    hue_seen = defaultdict(int)  # Dictionary to track how many times each hue is seen in different images

    image_files = scan_directory_for_images(directory)

    for image_file in image_files:
        print(f"Processing: {image_file}")
        hues = extract_hues(image_file, min_pixel_threshold)

        # Check for target hues
        for hue in hues:
            if target_hue_range[0] <= hue <= target_hue_range[1]:
                hue_seen[hue] += 1  # Increment count once per image for each hue in the range

    return hue_seen


# Function to export the result as a JSON file
def export_to_json(data, filename):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)
    print(f"Data successfully exported to {filename}")


# Example usage
directory = '/Users/Ashleigh/Desktop/Graphics'  # Update with your directory path

# Define the target hue range (e.g., 30 to 150 degrees)
target_hue_range = (20, 150)

# Track hues in the images with the min_pixel_threshold set to 30
hue_seen = track_hues_in_images(directory, target_hue_range, min_pixel_threshold=2000)

# Print out how many times each hue was seen (once per image)
for hue, count in sorted(hue_seen.items()):
    print(f"Hue {hue}° seen in {count} images.")

# Export the result to a JSON file
export_to_json(hue_seen, 'hues_seen.json')