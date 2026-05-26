import "./styles.css";
import * as tmImage from "@teachablemachine/image";
import { useRef, useState } from "react";

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const modelRef = useRef<any>(null);

  const [prediction, setPrediction] = useState("Waiting for scan...");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [facingMode, setFacingMode] = useState("environment"); // Default to rear lens
  const [loading, setLoading] = useState(false);

  const URL = "https://teachablemachine.withgoogle.com/models/qjWRn0dXc/";

  /* OPEN CAMERA */
  const openScanner = async (currentMode = facingMode) => {
    try {
      setLoading(true);
      setCameraOpen(true);
      setIsCaptured(false);
      setPrediction("Waiting for scan...");

      /* LOAD MODEL */
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";
      if (!modelRef.current) {
        modelRef.current = await tmImage.load(modelURL, metadataURL);
      }

      /* NATIVE WEBCAM STREAM */
      const constraints = {
        video: {
          facingMode: { ideal: currentMode },
          width: { ideal: 400 },
          height: { ideal: 400 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setLoading(false);
      }, 300);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      setCameraOpen(false);
      alert(
        `Camera failed to start. Error: ${
          error.message || error.name || "Unknown"
        }`
      );
    }
  };

  /* FLIP CAMERA */
  const flipCamera = async () => {
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);

    if (cameraOpen) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      await openScanner(newMode);
    }
  };

  /* SNAP & SCAN */
  async function captureAndPredict() {
    if (!videoRef.current || !modelRef.current) return;

    videoRef.current.pause();
    setIsCaptured(true);
    setPrediction("Analyzing data...");

    try {
      const predictions = await modelRef.current.predict(videoRef.current);

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
  function retakePhoto() {
    setIsCaptured(false);
    setPrediction("Waiting for scan...");
    if (videoRef.current) {
      videoRef.current.play();
    }
  }

  /* CLOSE CAMERA */
  const closeScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
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

          <div
            className="video-wrapper"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "350px",
              margin: "0 auto",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: "100%",
                aspectRatio: "1/1",
                objectFit: "cover",
                borderRadius: "20px",
                border: "4px solid black",
                display: "block",
                transform: facingMode === "user" ? "scaleX(-1)" : "none",
              }}
            />
            {loading && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "#fff",
                  background: "rgba(0,0,0,0.7)",
                  padding: "10px 20px",
                  borderRadius: "10px",
                }}
              >
                Loading Camera...
              </div>
            )}
          </div>

          <div className="predictionBox">{prediction}</div>

          <div className="camera-controls">
            {!isCaptured ? (
              <button
                className="scanButton"
                onClick={captureAndPredict}
                disabled={loading}
              >
                📸 SNAP & SCAN
              </button>
            ) : (
              <button className="scanButton" onClick={retakePhoto}>
                🔄 RETAKE PHOTO
              </button>
            )}

            {!isCaptured && (
              <button
                className="scanButton"
                onClick={flipCamera}
                disabled={loading}
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
        <div className="regions-wrapper" style={{ padding: "0 10px" }}>
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
        </div>
      )}
    </div>
  );
}

export default App;
