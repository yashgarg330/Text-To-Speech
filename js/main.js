//Init Speech Synth API
const synth = window.speechSynthesis;

// DOM Elements
const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
const body = document.querySelector("body");

//Browser identifier
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

//Init Voices Array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();
  // console.log(voices);

  //loop through voices and create an option for each one
  voices.forEach((voice) => {
    const option = document.createElement("option");

    // fill option with voice and message
    option.textContent = voice.name + "(" + voice.lang + ")";

    //set needed option attributes
    option.setAttribute("data.lang", voice.lang);
    option.setAttribute("data.name", voice.name);
    voiceSelect.appendChild(option);
  });
};

//causes voice list duplication
getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

//Fix for duplication, run code depending on the browser
if (isFirefox) {
    getVoices();
}
if (isChrome) {
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = getVoices;
    }
}

// Speak
const speak = () => {
  //check if speaking
  if (synth.speaking) {
    console.log("Already speaking...");
    return;
  }
  if (textInput.value !== "") {

    //Add background Animation
    body.style.background = '#141414 url(img/wave.gif)';
    body.style.backgroundRepeat = 'repeat-x';
    body.style.backgroundSize = '100% 100%';

    //Get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    //speak end
    speakText.onend = (e) => {
        body.style.background = '#141414';
        console.log("Done Speaking...");
    };

    //speak error
    speakText.onerror = (e) => {
      console.log("Something went wrong...");
    };

    //Select voice
    const selectedVoice =
      voiceSelect.selectedOptions[0].getAttribute("data-name");

    //Loop through voices
    voices.forEach((voice) => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    //Set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;

    //Speak
    synth.speak(speakText);
  }
};

//Add Event Listener

// Text form submit
textForm.addEventListener("submit", (e) => {
  e.preventDefault();
  speak();
  textInput.blur();
});

//Rate value change
rate.addEventListener("change", (e) => (rateValue.textContent = rate.value));

//Pitch value change
pitch.addEventListener("change", (e) => (pitchValue.textContent = pitch.value));

//Voice select change
voiceSelect.addEventListener("change", (e) => speak());
