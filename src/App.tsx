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
  const [isCaptured, setIsCaptured] = useState(false); // NEW: Tracks if a photo was taken

  const URL = "https://teachablemachine.withgoogle.com/models/qjWRn0dXc/";

  /* OPEN CAMERA */
  const openScanner = async () => {
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
      const webcam = new tmImage.Webcam(350, 350, true);
      webcamRef.current = webcam;

      /* ASK CAMERA PERMISSION */
      await webcam.setup({ facingMode: "user" });

      /* START CAMERA */
      await webcam.play();

      /* WAIT FOR VIDEO */
      await new Promise((resolve) => setTimeout(resolve, 500));

      /* SHOW LIVE VIDEO */
      if (webcamContainerRef.current) {
        webcamContainerRef.current.innerHTML = "";
        const canvas = webcam.canvas;
        canvas.style.width = "100%";
        canvas.style.maxWidth = "350px";
        canvas.style.borderRadius = "20px";
        canvas.style.border = "4px solid black";
        canvas.style.display = "block";
        canvas.style.margin = "0 auto";
        webcamContainerRef.current.appendChild(canvas);
      }

      /* START VIDEO FEED (No prediction here anymore) */
      animationRef.current = window.requestAnimationFrame(liveFeedLoop);
    } catch (error) {
      console.error(error);
      alert("Camera failed to start. Please allow camera permissions.");
    }
  };

  /* LIVE FEED LOOP (Only updates the canvas, doesn't run AI) */
  function liveFeedLoop() {
    if (!webcamRef.current) return;

    webcamRef.current.update(); // Keep the video feed moving
    animationRef.current = window.requestAnimationFrame(liveFeedLoop);
  }

  /* SNAP & SCAN (The new point-and-shoot function) */
  async function captureAndPredict() {
    if (!webcamRef.current || !webcamRef.current.canvas || !modelRef.current)
      return;

    // 1. Stop the live video loop
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // 2. Pause the webcam to create a "freeze frame" photo effect
    webcamRef.current.pause();
    setIsCaptured(true);
    setPrediction("Analyzing data..."); // Temporary loading text

    try {
      // 3. Run the AI once on the frozen frame
      const predictions = await modelRef.current.predict(
        webcamRef.current.canvas
      );

      let highest = predictions[0];
      for (let i = 1; i < predictions.length; i++) {
        if (predictions[i].probability > highest.probability) {
          highest = predictions[i];
        }
      }

      // 4. Show the result
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

    // Resume the webcam and the live feed loop
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
        <button className="scannerOrb" onClick={openScanner}></button>
        <h1>PHILIPPINE POKÉDEX</h1>
        <p>AI-powered wildlife scanner inspired by classic Pokédex systems.</p>
      </div>

      {/* OPEN BUTTON */}
      {!cameraOpen && (
        <button className="scanButton" onClick={openScanner}>
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
            {/* Toggle between Capture and Retake based on state */}
            {!isCaptured ? (
              <button className="scanButton" onClick={captureAndPredict}>
                📸 SNAP & SCAN
              </button>
            ) : (
              <button className="scanButton" onClick={retakePhoto}>
                🔄 RETAKE PHOTO
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
            <div className="animal-card">
              <img src="tamaraw.jpg" alt="Tamaraw" />
              <div className="card-content">
                <h2>#002 Tamaraw</h2>
                <div className="tags">
                  <span className="type ground">Ground</span>
                </div>
                <p>A rare wild buffalo native to Mindoro.</p>
              </div>
            </div>
          </div>

          {/* VISAYAS */}
          <h2 className="regionTitle">🌊 Visayas Region</h2>
          <div className="cards-container">
            <div className="animal-card">
              <img src="tarsier.jpg" alt="Tarsier" />
              <div className="card-content">
                <h2>#003 Tarsier</h2>
                <div className="tags">
                  <span className="type flying">Forest</span>
                </div>
                <p>A tiny nocturnal primate with massive glowing eyes.</p>
              </div>
            </div>
            <div className="animal-card">
              <img src="whaleshark.jpg" alt="Whale Shark" />
              <div className="card-content">
                <h2>#004 Whale Shark</h2>
                <div className="tags">
                  <span className="type ground">Ocean</span>
                  <span className="rarity legendary">Giant</span>
                </div>
                <p>The gentle giant of Philippine seas.</p>
              </div>
            </div>
          </div>

          {/* MINDANAO */}
          <h2 className="regionTitle">🌴 Mindanao Region</h2>
          <div className="cards-container">
            <div className="animal-card">
              <img src="dugong.jpg" alt="Dugong" />
              <div className="card-content">
                <h2>#005 Dugong</h2>
                <div className="tags">
                  <span className="type ground">Water</span>
                </div>
                <p>A peaceful marine mammal.</p>
              </div>
            </div>
            <div className="animal-card">
              <img src="crocodile.jpg" alt="Philippine Crocodile" />
              <div className="card-content">
                <h2>#006 Philippine Crocodile</h2>
                <div className="tags">
                  <span className="type ground">Reptile</span>
                  <span className="rarity legendary">Rare</span>
                </div>
                <p>One of the rarest crocodile species on Earth.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
