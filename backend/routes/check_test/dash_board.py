from flask import Blueprint, render_template, session
from utils.lay_du_lieu_thu_db import lay_tat_ca_file

dash_board = Blueprint('dash_board', __name__)

@dash_board.route('/dash_board_test')

def dash_board_test():
    user_email = session.get("user_gmail", "")
    du_lieu = lay_tat_ca_file(user_email, "file_info")
    return render_template('test.html', name='lvs', user_email=session.get("user_gmail", "User"), quyen_han='basic', goi_luu_tru='Basic', danh_sach_file=du_lieu["danh_sach_file"], danh_sach_file_da_xoa=du_lieu["danh_sach_file_da_xoa"])