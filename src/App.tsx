import { useState, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";

const URL = "https://teachablemachine.withgoogle.com/models/qjWRn0dXc/";

let model: any;

export default function App() {
  const [result, setResult] = useState("");
  const [location, setLocation] = useState("");
  const [fact, setFact] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    async function loadModel() {
      model = await tmImage.load(URL + "model.json", URL + "metadata.json");

      console.log("AI Model Loaded");
    }

    loadModel();
  }, []);

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];

    if (!file) return;

    setLoading(true);

    const imageURL = window.URL.createObjectURL(file);

    setImagePreview(imageURL);

    const img = document.createElement("img");

    img.src = imageURL;

    img.onload = async () => {
      const prediction = await model.predict(img);

      prediction.sort((a: any, b: any) => b.probability - a.probability);

      const best = prediction[0];

      setResult(best.className);

      if (best.className === "Philippine Eagle") {
        setLocation("Luzon");
        setFact("One of the largest eagles in the world.");
        setType("Flying / Legendary");
      } else if (best.className === "Tarsier") {
        setLocation("Visayas");
        setFact("Tiny primate famous for giant eyes.");
        setType("Forest / Psychic");
      } else if (best.className === "Dugong") {
        setLocation("Mindanao");
        setFact("Marine mammal related to manatees.");
        setType("Water");
      } else if (best.className === "Tamaraw") {
        setLocation("Luzon");
        setFact("Rare buffalo found only in Mindoro.");
        setType("Ground");
      } else if (best.className === "Philippine Crocodile") {
        setLocation("Mindanao");
        setFact("One of the rarest crocodiles alive.");
        setType("Reptile / Water");
      } else {
        setLocation("Unknown");
        setFact("Wildlife creature not recognized.");
        setType("Unknown");
      }

      setLoading(false);
    };
  };

  const cardStyle = {
    background: "linear-gradient(180deg,#ffffff,#f1f1f1)",
    borderRadius: "30px",
    padding: "18px",
    border: "6px solid #111",
    boxShadow: "0 10px 0 #111",
  };

  const imageStyle = {
    width: "100%",
    height: "220px",
    objectFit: "cover" as const,
    borderRadius: "18px",
    marginBottom: "15px",
    border: "4px solid #111",
  };

  return (
    <div
      style={{
        fontFamily: "Arial",
        background: "linear-gradient(180deg,#d62828 0%,#8b0000 100%)",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg,#ef233c,#9d0208)",
          color: "white",
          padding: "30px",
          borderRadius: "35px",
          marginBottom: "40px",
          border: "6px solid #111",
          boxShadow: "0 12px 0 #370617",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* BIG LIGHT */}
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "#4cc9f0",
            border: "6px solid white",
            boxShadow: "0 0 30px #4cc9f0",
            position: "absolute",
            top: "20px",
            right: "25px",
          }}
        />

        {/* SMALL LIGHTS */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "#90e0ef",
            }}
          />

          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "#ffd60a",
            }}
          />

          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "#70e000",
            }}
          />
        </div>

        <h1
          style={{
            fontSize: "58px",
            marginBottom: "10px",
            fontWeight: "900",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          Philippine Pokédex
        </h1>

        <p
          style={{
            fontSize: "18px",
            maxWidth: "600px",
            lineHeight: "1.5",
          }}
        >
          AI-powered wildlife scanner inspired by classic Pokédex systems.
        </p>
      </div>

      {/* LUZON */}
      <h2
        style={{
          color: "white",
          fontSize: "42px",
          marginBottom: "20px",
          textShadow: "4px 4px #111",
        }}
      >
        🌿 Luzon Region
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
          gap: "25px",
          marginBottom: "50px",
        }}
      >
        {/* EAGLE */}
        <div style={cardStyle}>
          <img src="eagle.jpg" style={imageStyle} />

          <h3
            style={{
              fontSize: "28px",
              marginBottom: "10px",
            }}
          >
            #001 Philippine Eagle
          </h3>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                background: "#4361ee",
                color: "white",
                padding: "8px 12px",
                borderRadius: "12px",
                fontWeight: "bold",
              }}
            >
              Flying
            </div>

            <div
              style={{
                background: "#ffbe0b",
                color: "black",
                padding: "8px 12px",
                borderRadius: "12px",
                fontWeight: "bold",
              }}
            >
              Legendary
            </div>
          </div>

          <p
            style={{
              lineHeight: "1.6",
              fontSize: "16px",
            }}
          >
            A massive sky predator known for its terrifying eyesight and immense
            wingspan. It silently patrols the forests of Luzon, striking fear
            into prey from above.
          </p>
        </div>

        {/* TAMARAW */}
        <div style={cardStyle}>
          <img src="tamaraw.jpg" style={imageStyle} />

          <h3
            style={{
              fontSize: "28px",
              marginBottom: "10px",
            }}
          >
            #002 Tamaraw
          </h3>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                background: "#6c757d",
                color: "white",
                padding: "8px 12px",
                borderRadius: "12px",
                fontWeight: "bold",
              }}
            >
              Ground
            </div>
          </div>

          <p
            style={{
              lineHeight: "1.6",
              fontSize: "16px",
            }}
          >
            This rare beast roams the mountains of Mindoro with unmatched
            endurance. Though calm in nature, it fiercely protects its territory
            from intruders.
          </p>
        </div>
      </div>

      {/* VISAYAS */}
      <h2
        style={{
          color: "white",
          fontSize: "42px",
          marginBottom: "20px",
          textShadow: "4px 4px #111",
        }}
      >
        🌊 Visayas Region
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
          gap: "25px",
          marginBottom: "50px",
        }}
      >
        {/* TARSIER */}
        <div style={cardStyle}>
          <img src="tarsier.jpg" style={imageStyle} />

          <h3
            style={{
              fontSize: "28px",
              marginBottom: "10px",
            }}
          >
            #003 Tarsier
          </h3>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                background: "#2d6a4f",
                color: "white",
                padding: "8px 12px",
                borderRadius: "12px",
                fontWeight: "bold",
              }}
            >
              Forest
            </div>

            <div
              style={{
                background: "#9b5de5",
                color: "white",
                padding: "8px 12px",
                borderRadius: "12px",
                fontWeight: "bold",
              }}
            >
              Psychic
            </div>
          </div>

          <p
            style={{
              lineHeight: "1.6",
              fontSize: "16px",
            }}
          >
            Despite its tiny size, this mysterious nocturnal creature possesses
            extraordinary agility and senses. Its glowing eyes allow it to hunt
            silently in darkness.
          </p>
        </div>

        {/* WHALE SHARK */}
        <div style={cardStyle}>
          <img src="whaleshark.jpg" style={imageStyle} />

          <h3
            style={{
              fontSize: "28px",
              marginBottom: "10px",
            }}
          >
            #004 Whale Shark
          </h3>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                background: "#0077b6",
                color: "white",
                padding: "8px 12px",
                borderRadius: "12px",
                fontWeight: "bold",
              }}
            >
              Water
            </div>
          </div>

          <p
            style={{
              lineHeight: "1.6",
              fontSize: "16px",
            }}
          >
            A gentle giant of the ocean that peacefully glides through tropical
            waters. Ancient legends claim its appearance signals calm seas
            ahead.
          </p>
        </div>
      </div>

      {/* MINDANAO */}
      <h2
        style={{
          color: "white",
          fontSize: "42px",
          marginBottom: "20px",
          textShadow: "4px 4px #111",
        }}
      >
        🌴 Mindanao Region
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
          gap: "25px",
          marginBottom: "60px",
        }}
      >
        {/* DUGONG */}
        <div style={cardStyle}>
          <img src="dugong.jpg" style={imageStyle} />

          <h3
            style={{
              fontSize: "28px",
              marginBottom: "10px",
            }}
          >
            #005 Dugong
          </h3>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                background: "#00b4d8",
                color: "white",
                padding: "8px 12px",
                borderRadius: "12px",
                fontWeight: "bold",
              }}
            >
              Water
            </div>
          </div>

          <p
            style={{
              lineHeight: "1.6",
              fontSize: "16px",
            }}
          >
            A peaceful marine guardian often called the "Sea Cow." It drifts
            slowly through shallow waters, feeding quietly among sea grass
            fields.
          </p>
        </div>

        {/* CROCODILE */}
        <div style={cardStyle}>
          <img src="crocodile.jpg" style={imageStyle} />

          <h3
            style={{
              fontSize: "28px",
              marginBottom: "10px",
            }}
          >
            #006 Philippine Crocodile
          </h3>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                background: "#588157",
                color: "white",
                padding: "8px 12px",
                borderRadius: "12px",
                fontWeight: "bold",
              }}
            >
              Reptile
            </div>

            <div
              style={{
                background: "#0077b6",
                color: "white",
                padding: "8px 12px",
                borderRadius: "12px",
                fontWeight: "bold",
              }}
            >
              Water
            </div>
          </div>

          <p
            style={{
              lineHeight: "1.6",
              fontSize: "16px",
            }}
          >
            One of the rarest predators in the world. This stealthy reptile
            lurks beneath murky rivers, waiting patiently before striking with
            explosive force.
          </p>
        </div>
      </div>

      {/* SCANNER */}
      <div
        style={{
          background: "linear-gradient(135deg,#ef233c,#9d0208)",
          padding: "40px",
          borderRadius: "40px",
          color: "white",
          border: "6px solid #111",
          boxShadow: "0 12px 0 #370617",
          marginTop: "60px",
        }}
      >
        {/* SCREEN */}
        <div
          style={{
            background: "#98f5e1",
            borderRadius: "25px",
            padding: "30px",
            border: "6px solid #111",
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              color: "#111",
              fontSize: "42px",
              marginBottom: "10px",
            }}
          >
            📟 WildScan Dex
          </h2>

          <p style={{ color: "#111" }}>
            Upload wildlife images for AI analysis.
          </p>

          <label
            style={{
              display: "inline-block",
              background: "#111",
              color: "white",
              padding: "18px 28px",
              borderRadius: "18px",
              border: "5px solid white",
              fontSize: "22px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 6px 0 #000",
              marginTop: "20px",
            }}
          >
            📸 OPEN CAMERA
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleUpload}
              style={{
                display: "none",
              }}
            />
          </label>
        </div>

        {/* PREVIEW */}
        {imagePreview && (
          <img
            src={imagePreview}
            style={{
              width: "100%",
              maxWidth: "350px",
              borderRadius: "20px",
              marginBottom: "25px",
              border: "6px solid white",
            }}
          />
        )}

        {/* LOADING */}
        {loading && (
          <div
            style={{
              background: "#111",
              padding: "20px",
              borderRadius: "20px",
              marginBottom: "20px",
              fontSize: "22px",
            }}
          >
            🔍 SCANNING CREATURE...
          </div>
        )}

        {/* RESULT */}
        {result && !loading && (
          <div
            style={{
              background: "#98f5e1",
              color: "#111",
              padding: "30px",
              borderRadius: "25px",
              border: "6px solid #111",
            }}
          >
            <h2
              style={{
                fontSize: "40px",
                marginBottom: "10px",
              }}
            >
              {result}
            </h2>

            <p>
              <strong>Region:</strong> {location}
            </p>

            <p>
              <strong>Type:</strong> {type}
            </p>

            <p>
              <strong>Info:</strong> {fact}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
