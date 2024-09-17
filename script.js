const typingForm = document.querySelector(".typing-form");
const chatlist = document.querySelector(".chat-list");
let userMessage = null;
//create a new message element and return it
const createMessageElement = (content, ...classes) =>{
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

const showLoadingAnimation = () => {
    const html = `<div class="message-content">

                <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" alt="gimini-png" class="avtar">

                <p class="text"></p>

                <div class="loading-indicator">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                </div>
            </div>
            <span class="icon material-symbols-rounded">content_copy</span>`

const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
 
chatlist.appendChild(incomingMessageDiv);
}

//handling sending outgoing chat messages
const handleOutgoingChat = () =>{
    userMessage = typingForm.querySelector(".typing-input").value.trim()

    if(!userMessage) return
    console.log(userMessage);
    const html = ` <div class="message-content">

                <img src="./pngtree-cartoon-color-simple-male-avatar-png-image_5230557.jpg" alt="USER-PNG" class="avtar">

                <p class="text"></p>
                
            </div>`

        const outgoingMessageDiv = createMessageElement(html, "outgoing");

        outgoingMessageDiv.querySelector(".text").innerText = userMessage;
        chatlist.appendChild(outgoingMessageDiv);

        typingForm.reset() //clear input field
}

typingForm .addEventListener("submit", (e) =>{
e.preventDefault();

handleOutgoingChat();
showLoadingAnimation();
})