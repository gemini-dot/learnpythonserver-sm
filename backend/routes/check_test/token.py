from flask import Blueprint,request

app_fac = Blueprint('face',__name__)

MY_VERIFY_TOKEN = "samvasang1192011"

@app_fac.route('/mes', methods=['GET'])
def verify():
    # Facebook gửi yêu cầu GET để kiểm tra Webhook
    mode = request.args.get("hub.mode")
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")

    if mode == "subscribe" and token == MY_VERIFY_TOKEN:
        print("WEBHOOK_VERIFIED")
        return challenge, 200 # BẮT BUỘC trả về challenge này
    
    return "Verification failed", 403
