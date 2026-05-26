import "./styles.css";
import * as tmImage from "@teachablemachine/image";
import { useRef, useState } from "react";

function App() {
  const webcamRef = useRef<any>(null);
  const webcamContainerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<any>(null);
  const animationRef = useRef<number>();

  const [prediction, setPrediction] = useState("Waiting for scan...");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);

  // Track which camera lens we are using ("environment" = back, "user" = front)
  const [facingMode, setFacingMode] = useState("environment");

  const URL = "https://teachablemachine.withgoogle.com/models/qjWRn0dXc/";

  /* OPEN CAMERA */
  const openScanner = async (currentMode = facingMode) => {
    try {
      setCameraOpen(true);
      setIsCaptured(false);
      setPrediction("Waiting for scan...");

      /* LOAD MODEL */
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      if (!modelRef.current) {
        modelRef.current = await tmImage.load(modelURL, metadataURL);
      }

      /* CREATE WEBCAM */
      // FIX 1: Only mirror the camera if we are using the front/user lens.
      const isFront = currentMode === "user";

      // FIX 2: Lower the resolution to 250x250.
      // Many phones crash if you ask for an exact 350x350 square.
      const webcam = new tmImage.Webcam(250, 250, isFront);
      webcamRef.current = webcam;

      /* ASK CAMERA PERMISSION */
      await webcam.setup({ facingMode: currentMode });

      /* START CAMERA */
      await webcam.play();

      /* WAIT FOR VIDEO */
      await new Promise((resolve) => setTimeout(resolve, 500));

      /* SHOW LIVE VIDEO */
      if (webcamContainerRef.current) {
        webcamContainerRef.current.innerHTML = "";
        const canvas = webcam.canvas;
        canvas.style.width = "100%";
        canvas.style.maxWidth = "350px"; // We can still stretch it via CSS to look good
        canvas.style.borderRadius = "20px";
        canvas.style.border = "4px solid black";
        canvas.style.display = "block";
        canvas.style.margin = "0 auto";
        webcamContainerRef.current.appendChild(canvas);
      }

      /* START VIDEO FEED */
      animationRef.current = window.requestAnimationFrame(liveFeedLoop);
    } catch (error: any) {
      console.error(error);
      // FIX 3: Show the ACTUAL error message the phone is throwing!
      alert(
        `Camera failed to start. Error: ${
          error.message || error.name || "Unknown"
        }`
      );
    }
  };

  /* FLIP CAMERA */
  const flipCamera = async () => {
    // Determine the opposite camera
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode); // Save to state

    // If the camera is currently on, we need to restart it
    if (cameraOpen) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (webcamRef.current) {
        webcamRef.current.stop();
        webcamRef.current = null;
      }

      // Start the scanner again with the new lens
      await openScanner(newMode);
    }
  };

  /* LIVE FEED LOOP */
  function liveFeedLoop() {
    if (!webcamRef.current) return;
    webcamRef.current.update();
    animationRef.current = window.requestAnimationFrame(liveFeedLoop);
  }

  /* SNAP & SCAN */
  async function captureAndPredict() {
    if (!webcamRef.current || !webcamRef.current.canvas || !modelRef.current)
      return;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    webcamRef.current.pause();
    setIsCaptured(true);
    setPrediction("Analyzing data...");

    try {
      const predictions = await modelRef.current.predict(
        webcamRef.current.canvas
      );

      let highest = predictions[0];
      for (let i = 1; i < predictions.length; i++) {
        if (predictions[i].probability > highest.probability) {
          highest = predictions[i];
        }
      }

      setPrediction(
        `${highest.className} (${(highest.probability * 100).toFixed(1)}%)`
      );
    } catch (error) {
      console.error(error);
      setPrediction("Error analyzing image.");
    }
  }

  /* RETAKE PHOTO */
  async function retakePhoto() {
    setIsCaptured(false);
    setPrediction("Waiting for scan...");
    await webcamRef.current.play();
    animationRef.current = window.requestAnimationFrame(liveFeedLoop);
  }

  /* CLOSE CAMERA */
  const closeScanner = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (webcamRef.current) {
      webcamRef.current.stop();
      webcamRef.current = null;
    }
    setCameraOpen(false);
    setIsCaptured(false);
    setPrediction("Waiting for scan...");
  };

  return (
    <div className="app">
      {/* HEADER */}
      <div className="header">
        <div className="lights">
          <span className="light red"></span>
          <span className="light yellow"></span>
          <span className="light green"></span>
        </div>
        <button
          className="scannerOrb"
          onClick={() => openScanner(facingMode)}
        ></button>
        <h1>PHILIPPINE POKÉDEX</h1>
        <p>AI-powered wildlife scanner inspired by classic Pokédex systems.</p>
      </div>

      {/* OPEN BUTTON */}
      {!cameraOpen && (
        <button className="scanButton" onClick={() => openScanner(facingMode)}>
          📷 OPEN WILDSCAN
        </button>
      )}

      {/* CAMERA & SCANNER UI */}
      {cameraOpen && (
        <div className="cameraSection">
          <h2>WildScan AI Camera</h2>

          <div ref={webcamContainerRef}></div>

          <div className="predictionBox">{prediction}</div>

          <div className="camera-controls">
            {/* Toggle between Capture and Retake */}
            {!isCaptured ? (
              <button className="scanButton" onClick={captureAndPredict}>
                📸 SNAP & SCAN
              </button>
            ) : (
              <button className="scanButton" onClick={retakePhoto}>
                🔄 RETAKE PHOTO
              </button>
            )}

            {/* FLIP CAMERA BUTTON */}
            {!isCaptured && (
              <button
                className="scanButton"
                onClick={flipCamera}
                style={{ marginTop: "10px", backgroundColor: "#3b82f6" }}
              >
                🔄 FLIP CAMERA
              </button>
            )}

            <button
              className="scanButton"
              onClick={closeScanner}
              style={{ marginTop: "10px", backgroundColor: "#ff4444" }}
            >
              ❌ CLOSE CAMERA
            </button>
          </div>
        </div>
      )}

      {/* POKEDEX CARDS */}
      {!cameraOpen && (
        <>
          {/* LUZON */}
          <h2 className="regionTitle">🌿 Luzon Region</h2>
          <div className="cards-container">
            <div className="animal-card">
              <img src="eagle.jpg" alt="Philippine Eagle" />
              <div className="card-content">
                <h2>#001 Philippine Eagle</h2>
                <div className="tags">
                  <span className="type flying">Flying</span>
                  <span className="rarity legendary">Legendary</span>
                </div>
                <p>
                  The Philippine Eagle is one of the rarest and most powerful
                  birds in the world.
                </p>
              </div>
            </div>
            {/* You can add the rest of your cards back here! */}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
