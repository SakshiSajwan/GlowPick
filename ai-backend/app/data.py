import csv
import requests

CSV_URL = "https://docs.google.com/spreadsheets/d/1LUOWpfg-OLkoHazMn3hybQOtAc5c9pE-AcGz706SPWU/export?format=csv"

def load_products():
    response = requests.get(CSV_URL)
    response.raise_for_status()

    decoded = response.content.decode("utf-8").splitlines()
    reader = csv.DictReader(decoded)

    products = []

    for row in reader:
        products.append({
            "id": row["id"],
            "name": row["name"],
            "brand": row["brand"],
            "price": f"${row['price']}",
            "image": row["image"],
            "concerns": [c.strip().lower() for c in row["concerns"].split(",")],
            "allergies": [a.strip().lower() for a in row["allergies"].split(",")],
            "reasons": [r.strip() for r in row["reasons"].split(";")],
        })

    return products