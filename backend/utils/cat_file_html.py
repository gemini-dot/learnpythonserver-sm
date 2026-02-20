from bs4 import BeautifulSoup


def super_fast_clean(html_content):
    soup = BeautifulSoup(html_content, "lxml")

    target_tags = ["script", "a", "iframe", "form", "embed", "object", "meta"]

    cleaned_data = []

    for tag_name in target_tags:
        for element in soup.find_all(tag_name):
            attrs = {
                k: v
                for k, v in element.attrs.items()
                if k in ["src", "href", "action", "content", "onclick", "onerror"]
            }

            text = element.get_text().strip()

            info = f"<{tag_name} attrs={attrs}>{text[:100]}</{tag_name}>"
            cleaned_data.append(info)

    return "\n".join(cleaned_data)
