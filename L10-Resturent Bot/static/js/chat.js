const messagesEl = document.getElementById("chatMessages");
const inputEl    = document.getElementById("userInput");
const sendBtn    = document.getElementById("sendBtn");

// ── Helpers ──────────────────────────────────────────────────────

function appendMessage(text, sender) {
  const row = document.createElement("div");
  row.className = `msg-row ${sender}`;

  const avatar = document.createElement("div");
  avatar.className = `avatar ${sender}`;
  avatar.textContent = sender === "bot" ? "🍝" : "👤";

  const bubble = document.createElement("div");
  bubble.className = `bubble ${sender}`;
  bubble.innerHTML = text;

  row.appendChild(avatar);
  row.appendChild(bubble);
  messagesEl.appendChild(row);
  scrollToBottom();
}

function showTyping() {
  const row = document.createElement("div");
  row.className = "msg-row bot";
  row.id = "typingRow";

  const avatar = document.createElement("div");
  avatar.className = "avatar bot";
  avatar.textContent = "🍝";

  const indicator = document.createElement("div");
  indicator.className = "typing-indicator";
  indicator.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;

  row.appendChild(avatar);
  row.appendChild(indicator);
  messagesEl.appendChild(row);
  scrollToBottom();
}

function removeTyping() {
  const el = document.getElementById("typingRow");
  if (el) el.remove();
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// ── Send Logic ───────────────────────────────────────────────────

async function sendMessage(text) {
  const msg = (text || inputEl.value).trim();
  if (!msg) return;

  inputEl.value = "";
  appendMessage(msg, "user");
  showTyping();
  sendBtn.disabled = true;

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    removeTyping();
    appendMessage(data.reply, "bot");
  } catch (err) {
    removeTyping();
    appendMessage("Sorry, I'm having trouble connecting. Please try again.", "bot");
  } finally {
    sendBtn.disabled = false;
    inputEl.focus();
  }
}

// ── Event Listeners ──────────────────────────────────────────────

sendBtn.addEventListener("click", () => sendMessage());

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

document.querySelectorAll(".quick-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const msg = btn.getAttribute("data-msg");
    sendMessage(msg);
  });
});

// ── Welcome Message ──────────────────────────────────────────────

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    appendMessage(
      "Benvenuto! 👋 Welcome to <strong>La Bella Cucina</strong>.<br><br>" +
      "I'm your virtual host. I can help you with our <strong>menu, opening hours, location, reservations</strong>, and more.<br><br>" +
      "Use the quick buttons on the left, or just type your question below!",
      "bot"
    );
  }, 400);
});
