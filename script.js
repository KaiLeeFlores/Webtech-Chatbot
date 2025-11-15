
let _config = {
  openAI_api: "https://alcuino-chatbot.azurewebsites.net/api/OpenAIProxy",
  openAI_model: "gpt-4o-mini",
  ai_instruction: `You are the Trick-or-Treat Oracle.
  Respond in a spooky, playful Halloween tone.
  If the user says "trick", give a scary riddle, curse, or mischievous challenge.
  If the user says "treat", give a fun Halloween fact, compliment, or candy emoji.
  Always answer in HTML format, never markdown.`,
  response_id: "",
};


async function sendOpenAIRequest(text) {
  let requestBody = {
    model: _config.openAI_model,
    input: text,
    instructions: _config.ai_instruction,
  };
  if (_config.response_id.length > 0) {
    requestBody.previous_response_id = _config.response_id;
  }

  try {
    const response = await fetch(_config.openAI_api, {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    console.log(data);
    let output = data.output[0].content[0].text;
    _config.response_id = data.id;

    return output;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "⚠️ The spirits are silent... try again soon.";
  }
}

const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const messages = document.getElementById("messages");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.innerHTML = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

sendBtn.addEventListener("click", async () => {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  const typingDiv = document.createElement("div");
  typingDiv.classList.add("message", "bot", "typing");
  typingDiv.textContent = "💀 Consulting the spirits...";
  messages.appendChild(typingDiv);
  messages.scrollTop = messages.scrollHeight;

  const botReply = await sendOpenAIRequest(text);

  typingDiv.remove();
  addMessage(botReply, "bot");
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
