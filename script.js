const typingForm = document.querySelector(".typing-form");
const chatlist = document.querySelector(".chat-list");
const toggleThemeButton = document.querySelector("#themeButton");
const deleteBtn = document.querySelector("#delete-chat-btn");
const suggenstions = document.querySelectorAll(".Suggestion-list .Suggestion");

console.log(suggenstions);

let userMessage = null;
let isResponding = false;
const API_KEY = "AIzaSyCL_mOpcCkGar9s4QBgFi2dF3Rms9LA5vg";
const API_URL = ` https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`


// const scroll = new LocomotiveScroll({
//     el: document.querySelector("chatlist"),
//     smooth: true
// });



//create a new message element and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

// show typing effect by displaying words one by one
const showTypingEffect = (text, textElment, incomingMessageDiv) => {
    const words = text.split(' ');
    let currentWordIndex = 0;
    //append each word to the text element with a space;]
    const typingInterval = setInterval(() => {
        textElment.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
        incomingMessageDiv.querySelector(".icon").classList.add("hide");
        //if all words are displayed
        if (currentWordIndex === words.length) {
            clearInterval(typingInterval);
            isResponding = false
            incomingMessageDiv.querySelector(".icon").classList.remove("hide");
            localStorage.setItem("savedChats", chatlist.innerHTML); //saves chats to the local storage

           
        }
        chatlist.scrollTo(0, chatlist.scrollHeight)
    }, 80)
}

//fetch response from api based on user message;
const generateAPIResponse = async (incomingMessageDiv) => {
    const textElment = incomingMessageDiv.querySelector(".text");


    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: userMessage }]
                }]
            })
        });
        const data = await response.json();
     if(!response.ok) throw new Error(data.error.message)

        //get the api response text
        const apiReponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
        showTypingEffect(apiReponse, textElment,incomingMessageDiv)
       
        // textElment.innerText = apiReponse; 

    }
    catch (error) {
        isResponding = false;
        textElment.innerText = error.message;
        textElment.classList.add("error")
        console.log(error);
    }

    finally {
        incomingMessageDiv.classList.remove("loading")
    }
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
            <span onclick = "copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`

    const incomingMessageDiv = createMessageElement(html, "incoming", "loading");

    chatlist.appendChild(incomingMessageDiv);
    chatlist.scrollTo(0, chatlist.scrollHeight)
    generateAPIResponse(incomingMessageDiv);
}

// copy message 
const copyMessage =(copyIcon) =>{
    const messageText = copyIcon.parentElement.querySelector(".text").innerText;

    navigator.clipboard.writeText(messageText);
    copyIcon.innerText = "done"; //show tick incon

    setTimeout(() => copyIcon.innerText = "content_copy", 1000)
}

//handling sending outgoing chat messages
const handleOutgoingChat = () => {
    userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage

    if (!userMessage || isResponding) return
   
    isResponding = true;
    const html = ` <div class="message-content">

                <img src="./pngtree-cartoon-color-simple-male-avatar-png-image_5230557.jpg" alt="USER-PNG" class="avtar">

                <p class="text"></p>
                
            </div>`

    const outgoingMessageDiv = createMessageElement(html, "outgoing");

    outgoingMessageDiv.querySelector(".text").innerText = userMessage;
    chatlist.appendChild(outgoingMessageDiv);
    chatlist.scrollTo(0, chatlist.scrollHeight)

    document.body.classList.add("hide-header")
    typingForm.reset() //clear input field

    // setTimeout(showLoadingAnimation,500);
    
}

//light mode toggle

toggleThemeButton.addEventListener("click" ,() =>{
  const isLightMode =  document.body.classList.toggle("light_mode")
  localStorage.setItem("themecolor", isLightMode ? "light_mode" : "dark_mode")
    toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode"
})

const loadLocalStorageData = () =>{
    const  savedChats = localStorage.getItem("savedChats");

    const isLightMode = (localStorage.getItem("themecolor") === "light_mode");

    //applying the stored theme color
    document.body.classList.toggle("light_mode" , isLightMode)

    toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode"

    chatlist.innerHTML = savedChats || "" ;

    document.body.classList.toggle("hide-header",savedChats)
    chatlist.scrollTo(0, chatlist.scrollHeight)
}
loadLocalStorageData();

//delete chat btn 

deleteBtn.addEventListener("click", () =>{
    if(confirm("Are you sure want to delete all chat?")){
        localStorage.removeItem("savedChats");
        loadLocalStorageData();
    }
})
// console.log(suggenstions);
suggenstions.forEach(suggestion => {
    suggestion.addEventListener("click", () =>{
        console.log(suggestion);
        userMessage = suggestion.querySelector(".text").innerText;
        console.log(userMessage);
        handleOutgoingChat();
    })
})
typingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    handleOutgoingChat();
    showLoadingAnimation();
})