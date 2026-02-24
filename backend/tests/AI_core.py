import numpy as np
from google.genai import Client
import os

google_api = "..."

client = Client(api_key=google_api)


def get_embedding(text):
    try:
        res = client.models.embed_content(
            model="models/gemini-embedding-001", contents=text
        )
        return res.embeddings[0].values
    except Exception as e:
        print(f"Lỗi: {e}")
        print("Đang quét danh sách model khả dụng...")
        for m in client.models.list():
            if "embed" in m.name.lower():
                print(f"-> Model bạn nên dùng là: {m.name}")
        return None


def test_logic():
    print("--- Đang kiểm tra Gemini Embedding 1 ---")
    text1 = "Làm sao để upload file lên VAULT?"
    text2 = "Cách tải tệp tin lên hệ thống"

    print(f"Đang lấy embedding cho câu 1...")
    vec1 = get_embedding(text1)

    print(f"Đang lấy embedding cho câu 2...")
    vec2 = get_embedding(text2)

    if vec1 and vec2:
        print(f"Thành công! Độ dài vector: {len(vec1)}")
        similarity = np.dot(vec1, vec2)

        print(f"Độ tương đồng giữa 2 câu: {similarity:.4f}")

        if similarity > 0.7:
            print("=> Kết luận: AI hiểu 2 câu này giống nhau. Ngon lành! :)")
        else:
            print("=> Kết luận: Điểm hơi thấp, og kiểm tra lại model nhé.")
    else:
        print("Không lấy được vector, check lại API Key trên Ubuntu của og nha!")


if __name__ == "__main__":
    test_logic()
