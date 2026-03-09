import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

EMAIL_REGEX = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"

def scrape_emails(url):
    emails = set()

    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, timeout=10, headers=headers)

        if response.status_code != 200:
            return []

        soup = BeautifulSoup(response.text, "html.parser")

        text = soup.get_text()
        emails.update(re.findall(EMAIL_REGEX, text))

        for link in soup.select("a[href^=mailto]"):
            email = link.get("href").replace("mailto:", "").split("?")[0]
            emails.add(email)

    except Exception as e:
        print(f"Error scraping {url}: {e}")

    return list(emails)

def scrape_subpages(url):
    subpages = set()
    base_url = urljoin(url, "/")
    
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, timeout=10, headers=headers)
        
        if response.status_code != 200:
            return []
            
        soup = BeautifulSoup(response.text, "html.parser")
        subpages.add(url)
        
        for link in soup.select("a[href]"):
            href = link.get("href")
            if href and not href.startswith("#") and not href.startswith("javascript:") and not href.startswith("mailto:"):
                full_url = urljoin(base_url, href)
                if urlparse(full_url).netloc == urlparse(base_url).netloc:
                    subpages.add(full_url)
                    
    except Exception as e:
        print(f"Error scraping subpages {url}: {e}")
        
    return list(subpages)