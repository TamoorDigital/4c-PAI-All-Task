from flask import Flask, render_template, request, send_file, abort
import pandas as pd
import os
import hashlib
from datetime import datetime
from scraper import scrape_emails, scrape_subpages

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
RESULT_FOLDER = "results"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

# 🔒 FOOTER PROTECTION
FOOTER_TEXT = "This tool is made by Muhammad Tamoor – AI Engineer & Automation Expert"
FOOTER_HASH = hashlib.sha256(FOOTER_TEXT.encode()).hexdigest()

def verify_signature(sig):
    return sig == FOOTER_HASH

@app.route("/", methods=["GET", "POST"])
def index():
    results = []
    download_file = None
    column_error = None

    # 🔒 Verify frontend signature
    signature = request.form.get("_sig")
    if request.method == "POST" and not verify_signature(signature):
        abort(403)

    if request.method == "POST":

        # SINGLE URL
        if request.form.get("url"):
            url = request.form["url"]
            subpages = request.form.get("subpages") == "on"
            urls = scrape_subpages(url) if subpages else [url]

            for u in urls:
                emails = scrape_emails(u)
                if emails:
                    for e in emails:
                        results.append({"URL": u, "Email": e})
                else:
                    results.append({"URL": u, "Email": "No email found"})

        # EXCEL
        if "file" in request.files:
            file = request.files["file"]
            if file and file.filename.endswith(".xlsx"):
                path = os.path.join(UPLOAD_FOLDER, file.filename)
                file.save(path)

                df = pd.read_excel(path)
                if "urls" not in df.columns:
                    column_error = 'Excel must contain column named "urls"'
                else:
                    for url in df["urls"].dropna():
                        emails = scrape_emails(str(url))
                        if emails:
                            for e in emails:
                                results.append({"URL": url, "Email": e})
                        else:
                            results.append({"URL": url, "Email": "No email found"})

        if results:
            name = f"emails_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            out = os.path.join(RESULT_FOLDER, name)
            pd.DataFrame(results).to_excel(out, index=False)
            download_file = out

    return render_template(
        "index.html",
        results=results,
        download_file=download_file,
        column_error=column_error,
        footer_hash=FOOTER_HASH
    )

@app.route("/download")
def download():
    sig = request.args.get("sig")
    if not verify_signature(sig):
        abort(403)
    return send_file(request.args.get("file"), as_attachment=True)

if __name__ == "__main__":
    app.run(debug=False)
