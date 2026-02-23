from google import genai
from google.genai import types
import time

client = genai.Client(api_key="...")

from ddgs import DDGS

def get_realtime_info(query):
    try:
        with DDGS() as ddgs:
            results = [r['body'] for r in ddgs.text(query, max_results=3)]
            if not results:
                print("SEARCH TRỐNG KHÔNG: Không tìm thấy gì trên mạng!")
                return "Không có thông tin mới."
            print(f"Đã tìm thấy {len(results)} đoạn tin tức.")
            return "\n".join(results)
    except Exception as e:
        print(f"❌ Lỗi Search: {e}")
        return ""

def check_html_code(html_content):
    # Nếu khách hỏi cái gì cần tin tức, og gọi hàm search trước
    search_data = get_realtime_info("Tin tức công nghệ hôm nay 23/02/2026")
    
    prompt_xi_ngau = f"""
    Dưới đây là thông tin cập nhật từ internet: {search_data}
    Dựa vào đó và kiến thức của bạn, hãy trả lời: {html_content}
    """
    
    # Giờ thì dùng Gemma 3 27B tẹt ga 14.400 lần/ngày không lo bị 'ngáo' thông tin nữa :))
    response = client.models.generate_content(
        model="gemma-3-27b-it",
        contents=prompt_xi_ngau
    )
    return response.text

print(check_html_code("xin chao ban nha, hom nay la ngay may"))