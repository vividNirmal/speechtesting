import React, { useState, useEffect } from 'react';
import { NoiseGateWorkletNode } from '@sapphi-red/web-noise-suppressor';

const SpeechRecognitionApp = () => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  let recognition;
  let audioContext;
  let noiseGateNode;

  useEffect(() => {
    // Initialize the Web Audio API context
    audioContext = new AudioContext();

    // Initialize the noise suppression node
    const initNoiseSuppression = async () => {
      await audioContext.audioWorklet.addModule('path/to/noiseGateWorklet.js');
      noiseGateNode = new NoiseGateWorkletNode(audioContext);
    };

    // Initialize the speech recognition API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          setTranscript(transcript + event.results[i][0].transcript);
        }
      }
    };

    initNoiseSuppression();

    return () => {
      recognition.stop();
      audioContext.close();
    };
  }, []);

  const startListening = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContext.createMediaStreamSource(stream);

    // Connect the source to the noise suppression node
    source.connect(noiseGateNode);
    noiseGateNode.connect(audioContext.destination);

    // Start the speech recognition
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognition.stop();
    setListening(false);
  };

  return (
    <div>
      <button onClick={startListening}>Start Listening</button>
      <button onClick={stopListening}>Stop Listening</button>
      <p>{listening ? '🎙️ Listening...' : 'Click "Start Listening" to begin'}</p>
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default SpeechRecognitionApp;
