
(() => {
    const FOOTER_TEXT = "This tool is made by Muhammad Tamoor – AI Engineer & Automation Expert";

    async function hash(text){
        const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
        return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
    }

    function crash(){
        document.body.innerHTML = `
        <div style="height:100vh;display:flex;align-items:center;
        justify-content:center;background:black;color:red;
        font-size:26px;text-align:center;">
        ❌ Tool Crashed<br><br>
        Please do not change or remove footer text.
        </div>`;
        throw new Error("Footer integrity violation");
    }

    document.addEventListener("DOMContentLoaded", async ()=>{
        const footer = document.getElementById("protected-footer");
        if(!footer || footer.innerText.trim() !== FOOTER_TEXT) crash();

        const sig = await hash(FOOTER_TEXT);
        document.querySelectorAll('input[name="_sig"]').forEach(i => i.value = sig);

        new MutationObserver(()=> {
            if(!footer || footer.innerText.trim() !== FOOTER_TEXT) crash();
        }).observe(document.body, { subtree:true, childList:true });
    });
})();

// ================= LOADER FUNCTIONS =================
function startSingleLoader() {
    document.getElementById("loader-overlay").style.display = "flex";
    document.getElementById("progress-bar").style.width = "100%";
}

function startExcelLoader() {
    document.getElementById("loader-overlay").style.display = "flex";
    let progress = 0;
    let bar = document.getElementById("progress-bar");

    let interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }
        bar.style.width = progress + "%";
    }, 400);
}

// ================= CLEAR RESULTS =================
function clearResults() {
    document.getElementById("results-table")?.remove();
    document.getElementById("action-buttons")?.remove();
    document.getElementById("no-email-message")?.remove();
    document.getElementById("loader-overlay").style.display = "none";
    document.getElementById("progress-bar").style.width = "0%";
}
