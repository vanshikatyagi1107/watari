// Elements
const newChatBtn = document.getElementById("new-chat-btn");
const downloadBtn = document.getElementById("download-btn");
const chatBox = document.getElementById("chat-box");
const suggestionButtons = document.querySelectorAll(".suggestion-btn");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

function addMessageToChat(message, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.innerText = message;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight; 
}

function sendUserMessage() {
  const userMessage = chatInput.value.trim();
  if (userMessage) {
    addMessageToChat(userMessage, "user");
    chatInput.value = "";
    getBotResponse(userMessage);
  }
}

function getBotResponse(userMessage) {
  fetch('/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ message: userMessage })
  })
    .then(response => response.json())
    .then(data => {
      if (data.response) {
        addMessageToChat(data.response, "bot");
      } else {
        addMessageToChat("Sorry, I didn't understand that. Can you rephrase?", "bot");
      }
    })
    .catch(error => {
      console.error('Error:', error);
      addMessageToChat("Sorry, there was an issue. Please try again.", "bot");
    }); 
}

// Event listener for the send button
sendBtn.addEventListener("click", sendUserMessage);

// Event listener for pressing Enter in the input field
chatInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendUserMessage();
  }
});

// Event listener for the "New Chat" button (clear chat history)
newChatBtn.addEventListener("click", () => {
  chatBox.innerHTML = "";
});

// Event listener for suggestion buttons (pre-fill the input field and send the message)
suggestionButtons.forEach(button => {
  button.addEventListener("click", function () {
    const suggestion = button.innerText;
    chatInput.value = suggestion;
    sendUserMessage();
  });
});

// Event listener for the "Download" button (download chat transcript)
downloadBtn.addEventListener("click", function () {
  const chatTranscript = chatBox.innerText;
  const blob = new Blob([chatTranscript], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "chat-transcript.txt";
  link.click();
});

