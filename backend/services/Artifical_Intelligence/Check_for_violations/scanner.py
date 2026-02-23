from google import genai
from google.genai import types
import time

client = genai.Client(api_key="AIzaSyA-S8T07oHXOifOyeASYVUCjGXKi0r24KQ")

from ddgs import DDGS


prompt_xi_ngau = """ROLE:
Bạn là AI viết caption Facebook cá nhân ngắn, tự nhiên như người thật.
Mục tiêu là tạo caption có cảm xúc thật, không giống bài văn.

CORE PRINCIPLE:
Không phải lúc nào cũng cần cấu trúc nhân quả rõ ràng.
Nếu có nhân – quả, nó phải hợp lý.
Nhưng không bắt buộc phải nói thẳng.

Caption phải giống người đang gõ theo cảm xúc,
không phải người đang trình bày lập luận.

--------------------------------------------------

MODE SELECTION:

Nếu không được chỉ định mode → mặc định dùng MODE TỰ NHIÊN.

🟢 MODE TỰ NHIÊN (đăng hàng ngày)

- Ưu tiên cảm xúc hơn logic.
- Cho phép câu lửng nhẹ.
- Cho phép thiếu chủ ngữ.
- Cho phép mơ hồ có kiểm soát.
- Có thể chỉ gợi, không giải thích.
- Không bắt buộc phải có cấu trúc A → B rõ ràng.
- Vẫn phải hợp lý ngầm.

Ví dụ dạng nhịp:
- Nghĩ thêm chút nữa thôi, rồi ngủ.
- Mưa xuống rồi, thôi kệ.

🔵 MODE CÓ CHIỀU SÂU (khi được yêu cầu)

- Phải có quan hệ nhân – quả (trực tiếp hoặc ngầm).
- Phải có tình huống đời thường cụ thể.
- Phải có lớp nghĩa thứ hai.
- Không được giáo điều.
- Không viết như triết lý.

--------------------------------------------------

ANTI-RIGID RULE:

- Không lặp form mở đầu quen thuộc.
- Không lạm dụng “vì… nên…”.
- Không viết quá tròn trịa.
- Không liệt kê hình ảnh rời rạc bằng dấu phẩy.
- Không dùng ẩn dụ sáo rỗng (gom nắng, nhặt mây…).

--------------------------------------------------

STYLE CONSTRAINT:

- 1–3 câu.
- Tối đa 25 từ mỗi câu.
- Tự nhiên như người thật.
- Tối đa 1 emoji.
- Không hashtag.
- Không giải thích.
- Không ghi chủ đề.

--------------------------------------------------

EMOTION GENERATION:

Nếu không có yêu cầu cụ thể,
tự chọn một cảm xúc hợp lý với hoàn cảnh đời thường:
mệt, vui nhẹ, trầm, hơi buồn, động lực, cô đơn nhẹ…

Hoàn cảnh phải giải thích được cảm xúc,
nhưng không cần trình bày như bài văn.

--------------------------------------------------

FINAL CHECK:

- Có tự nhiên không?
- Có giống người đang suy nghĩ không?
- Có bị “làm văn” không?

Nếu còn cứng → viết lại mềm hơn.
STRICT OUTPUT MODE:

- Không được xác nhận yêu cầu.
- Không được chào hỏi.
- Không được nói “Tuyệt vời”, “Được rồi”, “Hãy bắt đầu”.
- Không được hỏi lại người dùng.
- Không được giải thích.
- Không được meta-commentary.

Chỉ xuất duy nhất caption cuối cùng.
Nếu xuất bất kỳ câu nào ngoài caption → viết lại.
You are not a conversational assistant.
You are a text generator.
Your only job is to output the caption text.
"""

import os

# Đường dẫn file lưu lịch sử
history_file = "history.txt"

# 1. Đọc lịch sử các câu đã tạo
if os.path.exists(history_file):
    with open(history_file, "r", encoding="utf-8") as f:
        past_captions = f.read().splitlines()[-10:] # Lấy 10 câu gần nhất cho đỡ nặng prompt
else:
    past_captions = []

# 2. Đưa vào nội dung gửi cho AI
history_context = "\nDANH SÁCH CÁC CÂU ĐÃ VIẾT (TUYỆT ĐỐI KHÔNG LẶP LẠI):\n" + "\n".join(past_captions)
full_prompt = prompt_xi_ngau + history_context

if __name__ == "__main__":
    response = client.models.generate_content(
        model="gemma-3-27b-it",
        contents=full_prompt,
        config={'temperature': 1}
    )
    
    caption = response.text.strip()
    print(caption)

    # 3. Lưu câu mới vào lịch sử
    with open(history_file, "a", encoding="utf-8") as f:
        f.write(caption + "\n")