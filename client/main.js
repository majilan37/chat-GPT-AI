import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent.length > 3) {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateId() {
  const now = Date.now();
  const random = Math.random();
  const hexNumber = random.toString(16);

  return `_id-${now}-${hexNumber}`;
}

function chatStripe(isAi, value, id) {
  return `
    <div class="wrapper ${isAi && "ai"}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" alt="${isAi ? "bot" : "user"}" />
        </div>
        <div class="message" id=${id}>
          ${value}
        </div>
      </div>
    </div>
  `;
}

async function handleSubmit(e) {
  e.preventDefault();
  const data = new FormData(form);

  // * user's chat stripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  // * bot's chat stripe
  const id = generateId();
  chatContainer.innerHTML += chatStripe(true, " ", id);

  chatContainer.scrollTop = chatContainer.scrollHeight;
  console.log(`${id}`);
  const message = document.getElementById(`${id}`);
  console.log(message);

  loader(message);
  console.log(data.get("prompt"));
  // * Fetch data from the server
  const response = await fetch("http://localhost:5000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt") || "",
    }),
  });

  clearInterval(loadInterval);
  message.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parsed = data.bot.trim();
    console.log(parsed);
    typeText(message, parsed);
  } else {
    const err = await response.text();
    message.innerHTML = err;
  }
}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) handleSubmit(e);
});
