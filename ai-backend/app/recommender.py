import requests
import csv
from io import StringIO

def normalize_image_url(url: str) -> str:
    """
    Converts Google Drive links to direct image URLs.
    Safely ignores unsupported links like share.google.
    """
    if not url:
        return ""

    url = url.strip()

    # Handle Google Drive file links
    if "drive.google.com" in url and "/file/d/" in url:
        try:
            file_id = url.split("/file/d/")[1].split("/")[0]
            return f"https://drive.google.com/uc?id={file_id}"
        except Exception:
            return ""

    # share.google links cannot be embedded as images
    if "share.google" in url:
        return ""

    # Already a valid image URL
    return url

GOOGLE_SHEET_CSV_URL = (
    "https://docs.google.com/spreadsheets/d/"
    "1LUOWpfg-OLkoHazMn3hybQOtAc5c9pE-AcGz706SPWU"
    "/export?format=csv"
)

def load_products_from_sheet():
    response = requests.get(GOOGLE_SHEET_CSV_URL)
    response.raise_for_status()

    csv_data = response.text
    reader = csv.DictReader(StringIO(csv_data))
    return list(reader)


def recommend(skin_profile):
    products = load_products_from_sheet()

    print("DEBUG SAMPLE:", products[0])  # 👈 IMPORTANT

    selected_concerns = [
        c.lower() for c in skin_profile.skin_concerns
    ]
    selected_allergies = [
        a.lower() for a in skin_profile.allergies
    ]

    recommendations = []

    for product in products:
        # 🔥 support both column types
        product_concerns = [
            c.strip().lower()
            for c in (
                product.get("concerns") or product.get("concern", "")
            ).split(",")
        ]

        product_allergens = [
            a.strip().lower()
            for a in (
                product.get("contains") or product.get("allergens", "")
            ).split(",")
        ]

        if any(a in product_allergens for a in selected_allergies):
            continue

        if any(c in product_concerns for c in selected_concerns):
            recommendations.append({
                "id": product.get("id"),
                "name": product.get("name"),
                "brand": product.get("brand"),
                "price": product.get("price"),
                "image": normalize_image_url(product.get("image", "")),
                "reasons": (
                    product.get("benefits") or product.get("reason", "")
                ).split(",")
            })

    print("FINAL MATCHED:", recommendations)  # 👈 DEBUG

    return recommendations[:8]