import requests
from flask import Response, Blueprint

show_html_domain = Blueprint("show html domain",__name__)

@show_html_domain.route("/<username>/site/<path:duong_dan_file>")
def hien_thi_trang_ca_nhan(username, duong_dan_file):
    link_github_goc = f"https://gemini-dot.github.io/html_upload/users/{username}/{duong_dan_file}"

    try:
        lay_file = requests.get(link_github_goc)

        if lay_file.status_code == 404:
            return "Lỗi rách việc: Không tìm thấy trang của ông kẹ này!", 404
        
        return Response(
            lay_file.content, 
            mimetype=lay_file.headers.get('content-type', 'text/html')
        ), 200
    except Exception as e:
        return f"Lỗi hệ thống người trung gian: {e}", 500