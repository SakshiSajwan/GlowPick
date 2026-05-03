# glowpick-backend/app/main.py

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import SkinProfile
from app.recommender import recommend
import json

app = FastAPI()


# ✅ CORS (must be before routes ideally)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"message": "FastAPI running 🚀"}


@app.post("/recommend")
async def recommend_products(
    profile: str = Form(...),
    selfie: UploadFile = File(...)
):
    try:
        # ✅ Parse profile safely
        profile_dict = json.loads(profile)

        # ✅ Ensure required fields exist
        skin_profile = SkinProfile(
            skin_concerns=profile_dict.get("skin_concerns", []),
            allergies=profile_dict.get("allergies", [])
        )

        print("PROFILE RECEIVED:", profile_dict)

        # ❗ Optional: read image (just to confirm upload works)
        image_bytes = await selfie.read()
        print("IMAGE SIZE:", len(image_bytes))

        # ✅ Get recommendations
        products = recommend(skin_profile)

        print("PRODUCTS FOUND:", len(products))

        return {
            "skinType": "Combination",
            "concerns": skin_profile.skin_concerns,
            "products": products
        }

    except Exception as e:
        print("ERROR:", e)
        return {
            "error": str(e),
            "products": []
        }