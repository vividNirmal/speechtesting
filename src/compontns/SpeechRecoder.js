import React, { useState, useEffect } from "react";

const VoiceToText = () => {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);

  useEffect(() => {
    // Check if the browser supports the SpeechRecognition API
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      // Create an instance of SpeechRecognition
      const recognition = new SpeechRecognition();

      // Set properties
      recognition.continuous = true; // Keep listening even after the speech has paused
    //   recognition.interimResults = false; // Show results even while the user is still speaking
      recognition.lang = "en-US";
      // Define event handlers
      recognition.onstart = () => 
        (true);
      recognition.onend = () => setListening(true);
      recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          interimTranscript += event.results[i][0].transcript;
        }
        setTranscript(interimTranscript);
        console.log(interimTranscript);
      };

      // Start speech recognition
      recognition.start();

      // Clean up
      return () => {
        recognition.stop();
      };
    } else {
      console.log("Speech recognition not supported in this browser.");
    }
  }, []);

  return (
    <div>
      <p>Microphone: {listening ? "on" : "off"}</p>
      <button onClick={() => setTranscript("")}>Reset</button>
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default VoiceToText;
