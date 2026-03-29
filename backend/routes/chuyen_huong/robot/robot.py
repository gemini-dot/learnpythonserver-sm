from flask import Blueprint

robot_site = Blueprint("robot_txt", __name__)

@robot_site.route('/robots.txt')
def robots_txt():
    content = "User-agent: *\nDisallow: /admin/\nAllow: /"
    return content, 200, {'Content-Type': 'text/plain'}