import cloudinary
import os

cloudinary.config(
    cloud_name=str(os.getenv("CLOUDINARY_NAME")),
    api_key=str(os.getenv("CLOUDINARY_API")),
    api_secret=str(os.getenv("CLOUDINARY_SECRET")),
    secure=True,
)
