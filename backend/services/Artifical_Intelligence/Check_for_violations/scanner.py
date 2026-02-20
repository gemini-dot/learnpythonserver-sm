import os
from google.genai import Client
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))
from utils.cat_file_html import super_fast_clean

client = Client(api_key="AIzaSyAtw2AuvgqrKGRlm2PXM_K2iBtkSg8Ogkk")


def check_html_code(html_content):

    prompt = (
        f"Hãy phân tích mã HTML sau: {html_content}. "
        "Nếu mã này an toàn, chỉ trả về đúng một từ 'SAFE'. "
        "Nếu có dấu hiệu lừa đảo, script độc hại hoặc link bẩn, chỉ trả về đúng từ 'DANGEROUS'. "
        "TUYỆT ĐỐI không giải thích, không viết thêm gì khác."
    )

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt,
    )
    res = response.text.strip()
    return res
