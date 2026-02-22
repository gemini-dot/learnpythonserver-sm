from google import genai
import time

client = genai.Client(api_key="...")

# Danh sách các model og nên thử theo thứ tự ưu tiên
test_models = [
    "models/gemini-1.5-flash", 
    "models/gemini-flash-latest",
    "models/gemini-2.0-flash", 
    "models/gemma-3-4b-it"
]

def check_html_code(html_content):
    # Đảm bảo prompt là một chuỗi string sạch
    prompt_text = f"Hãy phân tích mã HTML sau: {html_content}. Nếu an toàn trả về SAFE, nếu độc hại trả về DANGEROUS."
    
    try:
        # Cách gọi chuẩn của SDK google-genai 1.x
        response = client.models.generate_content(
            model="gemini-flash-lite-latest", # Bỏ chữ models/ đi nếu dùng SDK mới
            contents=prompt_text
        )
        
        if response and response.text:
            return response.text.strip()
        return "Không có phản hồi"
        
    except Exception as e:
        return f"Lỗi cụ thể: {str(e)}"

# QUAN TRỌNG: Phải print kết quả ra
print(check_html_code("<html><body>hello</body></html>"))