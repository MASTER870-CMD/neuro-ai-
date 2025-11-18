

















let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");





function speak(text, lang = "en") {
  text = text.replace(/\*/g, ""); // remove all asterisks

  let utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1;
  utterance.pitch = 1.2;
  utterance.volume = 1;

  const setVoiceAndSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    let preferred = voices.find(v =>
      v.lang.startsWith(lang) &&
      (v.name.toLowerCase().includes("female") ||
       v.name.toLowerCase().includes("zira") ||
       v.name.toLowerCase().includes("woman") ||
       v.name.toLowerCase().includes("google uk english female") ||
       v.name.toLowerCase().includes("samantha"))
    );

    if (!preferred) {
      preferred = voices.find(v => v.lang.startsWith(lang));
    }

    if (preferred) {
      utterance.voice = preferred;
    }

    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => setVoiceAndSpeak();
  } else {
    setVoiceAndSpeak();
  }
}



function wishMe() {
  let hours = new Date().getHours();
  if (hours < 12) speak("Good Morning user, it is nice to meet you once again");
  else if (hours < 17) speak("Good afternoon user");
  else speak("Good evening user, it is nice to meet you once again");
}


function saveReminder(task, time24, displayTime) {
  const reminderTime = new Date();
  const [hours, minutes] = time24.split(":");
  reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  const delay = reminderTime.getTime() - Date.now();

  if (delay > 0) {
    const clockPanel = document.getElementById("clockPanel");

    const reminderItem = document.createElement("div");
    reminderItem.className = "reminder";
    reminderItem.style.fontSize = "16px";
    reminderItem.style.marginTop = "6px";
    reminderItem.innerHTML = `⏰ <b>${displayTime}</b> – ${task}`;
    clockPanel.appendChild(reminderItem);

    setTimeout(() => {
      speak(`Reminder alert! It's time to ${task}`);
      reminderItem.style.color = "yellow";
      reminderItem.innerHTML = `⏰ <b>${displayTime}</b> – ✅ ${task}`;
    }, delay);
  } else {
    speak("The reminder time has already passed.");
  }
}



function saveNote(note) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
}

function readNotes() {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  if (notes.length === 0) speak("You have no notes.");
  else {
    speak("Opening your notes.");
    window.location.href = "notes.html";
  }
}

function clearNotes() {
  localStorage.removeItem("notes");
  speak("All notes have been cleared.");
}

setInterval(() => {
  const now = new Date();
  const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
  const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
  reminders.forEach((reminder, index) => {
    if (reminder.time === currentTime) {
      speak("⏰ Reminder: " + reminder.message);
      reminders.splice(index, 1);
      localStorage.setItem("reminders", JSON.stringify(reminders));
    }
  });
}, 60000);

window.addEventListener("load", () => {
  wishMe();

  const shouldRedirect = localStorage.getItem("redirectAfterSave");
  if (shouldRedirect === "yes") {
    const name = localStorage.getItem("pendingName");
    const msg = localStorage.getItem("pendingMsg");
    const contacts = JSON.parse(localStorage.getItem("contacts")) || {};
    if (name && msg && contacts[name]) {
      speak(`Sending message to ${name}`);
      localStorage.setItem("redirectPhone", contacts[name]);
      localStorage.setItem("redirectMsg", msg);
      localStorage.removeItem("redirectAfterSave");
      localStorage.removeItem("pendingName");
      localStorage.removeItem("pendingMsg");
      setTimeout(() => window.location.href = "redirect.html", 2000);
    }
  }
});

let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();

recognition.onresult = (event) => {
  let transcript = event.results[event.resultIndex][0].transcript.toLowerCase();
  content.innerText = transcript;
  takeCommand(transcript);
};

btn.addEventListener("click", () => {
  recognition.start();
  btn.style.display = "none";
  voice.style.display = "block";
});

async function takeCommand(message) {
  btn.style.display = "flex";
  voice.style.display = "none";

  if (message.includes("helloooooooooooooooo") || message.includes("hiiiiiiiiiiiii")) {
    speak("Hello sir, what can I help you with?");
  } else if (message.includes("who are you") || message.includes("who created you")) {
    speak("I am a virtual assistant created by Shashank Gowda NB");
  }else if (message.includes("interduce your self") || message.includes("interduce yourself")) {
    speak("Hello! I’m Vox AI, your personal virtual assistant. I was created by Shashank Gowda NB to help you with daily tasks, answer your questions, and make your digital life smoother. I can take notes, set reminders, translate, play music, and more — all by voice. Just ask, and I’ll be happy to assist.");
  }else if (message.includes("time")) {
    let time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    speak(time);
  } 

else if (message.startsWith("remind me to")) {
  let msg = message.replace("remind me to", "").trim();
  const timeMatch = msg.match(/at\s*(\d{1,2})[-:.,\s]?(\d{1,2})?\s*(am|pm)?/i);

  if (timeMatch) {
    let hour = parseInt(timeMatch[1]);
    let minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const period = timeMatch[3];

    if (period) {
      if (period.toLowerCase() === "pm" && hour < 12) hour += 12;
      if (period.toLowerCase() === "am" && hour === 12) hour = 0;
    }

    const timeString = hour.toString().padStart(2, '0') + ":" + minute.toString().padStart(2, '0');

    msg = msg.replace(/at\s*\d{1,2}[-:.,\s]?\d{0,2}?\s*(am|pm)?/i, "").trim();

    const displayHour = hour % 12 || 12;
    const displayMinute = minute.toString().padStart(2, "0");
    const displayPeriod = hour >= 12 ? "PM" : "AM";
    const displayTime = `${displayHour}:${displayMinute} ${displayPeriod}`;

    speak(`Reminder set to ${msg} at ${displayTime}`);
    saveReminder(msg, timeString, displayTime);
  } else {
    speak("Please say a time like 5 PM or 12:30 AM to set the reminder.");
  }
}





 else if (message.startsWith("take a note") || message.startsWith("add to my list")) {
    let note = message.replace("take a note", "").replace("add to my list", "").trim();
    if (note) note.split(/,| and /).forEach(n => saveNote(n.trim()));
    else speak("What would you like me to note?");
  } else if (message.includes("show my notes")) {
    readNotes();
  } else if (message.includes("clear my notes") || message.includes("delete my notes") || message.startsWith("delete all my list")|| message.startsWith("clear")) {
    clearNotes();
  }
  else if (message.includes("host my website")|| message.includes("deploy my website")||message.includes("host")) {
  speak("Upload your zip file I will deploy the web to internet");
  window.location.href = "/web_host/dash/dash.html";
}

// Google search
else if (message.toLowerCase().includes("search in google") || message.toLowerCase().includes("search")) {
  // Extract the query part by removing "search in google" or "search" from the message
  let query = message.replace(/(search in google|search)/i, "").trim();
  
  // If there is something to search, perform the Google search
  if (query.length > 0) {
    let googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.location.href = googleSearchUrl;
  } else {
    speak("Please provide a search query after the command.");
  }
}


// Google search 




   else if (message.includes("play")) {
    await handlePlayCommand(message);
  }else if (message.includes("send a file to my phone")|| message.includes("send file")|| message.includes("send a file")) {
  window.location.href = "./file/file-share.html";
}
else if (message.includes("organize")|| message.includes("organize my files")) {
  speak("Upload your zip file I will organize it");
  window.location.href = "./file_Organizer/org.html";
}
   else if (message.startsWith("send a message to")|| message.includes("send a")) {
    handleSendMessage(message);
  } else if (message.includes("translate")) {
    await handleTranslation(message);
  } else {
    speak("");
    await fetchGemini(message);
  }
}

function handleSendMessage(message) {
  let parts = message.split("send a message to")[1]?.trim();
  if (!parts) {
    speak("I couldn't understand the name and message.");
    return;
  }
  let words = parts.split(" ");
  let name = words[0]?.toLowerCase();
  let msg = words.slice(1).join(" ").trim();
  let storedContacts = JSON.parse(localStorage.getItem("contacts")) || {};
  if (!name) {
    speak("I couldn't identify the name.");
    return;
  }
  if (!storedContacts[name]) {
    speak(`${name} is not found in your contact list. Redirecting to contact page.`);
    localStorage.setItem("pendingName", name);
    localStorage.setItem("pendingMsg", msg);
    setTimeout(() => {
      window.location.href = "contact.html";
    }, 3000);
  } else if (!msg) {
    speak(`What is the message to ${name}?`);
  } else {
    speak(`Sending message to ${name}: ${msg}`);
    localStorage.setItem("redirectPhone", storedContacts[name]);
    localStorage.setItem("redirectMsg", msg);
    setTimeout(() => {
      window.location.href = "redirect.html";
    }, 2000);
  }
}

async function handlePlayCommand(message) {
  let songQuery = message
    .replace("play me a song", "")
    .replace("play a song", "")
    .replace("play", "")
    .replace("song", "")
    .trim();

  if (!songQuery) {
    speak("Please specify the song you want to play.");
    return;
  }

  speak(`Playing ${songQuery} on YouTube.`);

  let query = encodeURIComponent(songQuery);
  let apiKey = "AIzaSyCVMoQBAaBhgY9dUKGD3s3J995OjA2zPuk";
  let apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${apiKey}&maxResults=1`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    const videoId = data.items[0]?.id?.videoId;

    if (videoId) {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}&autoplay=1`;
      window.open(videoUrl, "_blank");
    } else {
      speak("Sorry, I couldn’t find that song.");
    }
  } catch (error) {
    console.error("YouTube API Error:", error);
    speak("There was a problem accessing YouTube.");
  }
}

async function fetchGemini(query) {
  const apiKey = "AIzaSyDeNfp7rEQ-iZ1e2Lyuz01yGk9FYcgwhy4";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: query }] }]
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (reply) {
      const firstSentence = reply.split(/[.!?]/)[0].trim();
      speak(firstSentence);
    } else {
      speak("Sorry, I couldn’t find a suitable response.");
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    speak("There was an error while getting the answer from Gemini.");
  }
}



async function handleTranslation(message) {
  const langMap = {
    hindi: "hi", kannada: "kn", marathi: "mr", urdu: "ur",
    tamil: "ta", telugu: "te", bengali: "bn", gujarati: "gu", english: "en"
  };

  const match = message.match(/translate (.*?) to (.+)/i);
  if (!match) {
    speak("Please say something like 'translate hello to Kannada'.");
    return;
  }

  const text = match[1].trim();
  const cleanedLang = match[2].replace(/[^a-z]/gi, '').toLowerCase();
  const targetCode = langMap[cleanedLang];

  if (!targetCode) {
    speak("Sorry, I don't support that language yet.");
    return;
  }

  const bodyJson = JSON.stringify({
    from: "en", to: targetCode, text: text
  });

  try {
    const response = await fetch("https://google-translate113.p.rapidapi.com/api/v1/translator/text", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "285dde9a58mshd8615ff85debb5bp17dd56jsn106df172320a",
        "X-RapidAPI-Host": "google-translate113.p.rapidapi.com"
      },
      body: bodyJson
    });

    const data = await response.json();
    const translated = data.trans;

    if (translated) speak(translated, targetCode);
    else speak("Sorry, I couldn't translate that.");
  } catch (error) {
    console.error("Translation Error:", error);
    speak("There was an error while translating. Please try again.");
  }

function saveReminder(task, time24, displayTime) {
  const reminderTime = new Date();
  const [hours, minutes] = time24.split(":");
  reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  const delay = reminderTime.getTime() - Date.now();

  if (delay > 0) {
    const clockPanel = document.getElementById("clockPanel");

    const reminderItem = document.createElement("div");
    reminderItem.className = "reminder";
    reminderItem.style.fontSize = "16px";
    reminderItem.style.marginTop = "6px";
    reminderItem.innerHTML = `⏰ <b>${displayTime}</b> – ${task}`;
    clockPanel.appendChild(reminderItem);

    setTimeout(() => {
      speak(`Reminder alert! It's time to ${task}`);
      reminderItem.style.color = "yellow";
      reminderItem.innerHTML = `⏰ <b>${displayTime}</b> – ✅ ${task}`;
    }, delay);
  } else {
    speak("The reminder time has already passed.");
  }
}



}

