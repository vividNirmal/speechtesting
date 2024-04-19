import React, { useState, useEffect } from "react";

const VoiceToText = () => {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  // const [frequencyData, setFrequencyData] = useState(new Uint8Array(0));
  useEffect(() => {
    // navigator.mediaDevices
    //   .getUserMedia({ audio: true })
    //   .then((stream) => {
    //     const audioContext = new AudioContext();
    //     const analyser = audioContext.createAnalyser();
    //     const microphone = audioContext.createMediaStreamSource(stream);
    //     microphone.connect(analyser);
    //     analyser.fftSize = 2048;
    //     const bufferLength = analyser.frequencyBinCount;
    //     const dataArray = new Uint8Array(bufferLength);

    //     const getFrequencyData = () => {
    //       analyser.getByteFrequencyData(dataArray);
    //       // Focus on the higher part of the array for high frequencies
    //       const highFrequencyData = dataArray.slice(dataArray.length / 2);
    //       setFrequencyData(highFrequencyData);
    //       // Call this function repeatedly to keep updating the frequency data
    //       requestAnimationFrame(getFrequencyData);
    //     };

    //     getFrequencyData();
    //   })
    //   .catch((error) => {
    //     console.error("Error accessing the microphone", error);
    //   });
    // Check if the browser supports the SpeechRecognition API
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    // const SpeechSynthesis =window.SpeechSynthesis
    if (SpeechRecognition) {
      // Create an instance of SpeechRecognition
      const recognition = new SpeechRecognition();

      recognition.continuous = true; // Keep listening even after the speech has paused

      recognition.lang = "en-US";
      // Define event handlers
      recognition.onstart = () => true;
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

      // window.speechSynthesis.speak(utterance)
      // Clean up
      return () => {
        recognition.stop();
      };
    } else {
      console.log("Speech recognition not supported in this browser.");
    }
  }, [transcript]);


  function speak() {
    let synth = speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(transcript);
    utterance.lang = "hi-IN";
    // utterance.pitch = 0.8
    // utterance.volume=1.5
    // utterance.rate=.8
    return synth.speak(utterance);
  }

  return (
    <div>
      <p>Microphone: {listening ? "on" : "off"}</p>
      <h1>herer new bild up</h1>
      <button onClick={() => setTranscript("")}>Reset</button>
      <button onClick={speak}>speak</button>
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default VoiceToText;
