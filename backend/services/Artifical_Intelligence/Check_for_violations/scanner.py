import os
from google.genai import Client

client = Client(api_key="you_cant_see")

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
    return response.text.strip()
print(check_html_code("<html><body><h1>Hello World</h1></body></html>"))