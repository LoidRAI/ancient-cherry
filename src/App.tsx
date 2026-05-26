import { useState } from "react";
import "./styles.css";

export default function App() {
  const [screen, setScreen] = useState("home");

  const animals = {
    luzon: [
      {
        name: "Philippine Eagle",
        type: "Legendary Bird",
        rarity: "SSS",
        desc: "The ruler of Philippine skies with gigantic wings and deadly vision.",
        img: "/eagle.jpg",
      },

      {
        name: "Tamaraw",
        type: "Ground Beast",
        rarity: "S",
        desc: "A rare wild buffalo hidden deep in Mindoro forests.",
        img: "/tamaraw.jpg",
      },
    ],

    visayas: [
      {
        name: "Tarsier",
        type: "Forest Creature",
        rarity: "A",
        desc: "Tiny night hunter with glowing eyes and silent movement.",
        img: "/tarsier.jpg",
      },

      {
        name: "Whale Shark",
        type: "Ocean Giant",
        rarity: "SS",
        desc: "Massive peaceful sea guardian swimming through tropical waters.",
        img: "/whaleshark.jpg",
      },
    ],

    mindanao: [
      {
        name: "Dugong",
        type: "Water Creature",
        rarity: "S",
        desc: "A peaceful ocean creature related to ancient manatees.",
        img: "/dugong.jpg",
      },

      {
        name: "Philippine Crocodile",
        type: "Reptile",
        rarity: "SS",
        desc: "One of the rarest and most dangerous reptiles alive.",
        img: "/crocodile.jpg",
      },
    ],
  };

  const renderAnimals = (region: keyof typeof animals) => (
    <div className="content">
      <button className="backBtn" onClick={() => setScreen("home")}>
        ← Back
      </button>

      <h1 className="regionTitle">{region.toUpperCase()} REGION</h1>

      {animals[region].map((animal, index) => (
        <div className="card" key={index}>
          <img src={animal.img} className="animalImg" />

          <div className="cardBody">
            <h2>
              #{index + 1} {animal.name}
            </h2>

            <div className="badgeContainer">
              <span className="typeBadge">{animal.type}</span>

              <span className="rarityBadge">{animal.rarity}</span>
            </div>

            <p>{animal.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="app">
      {/* TOPBAR */}
      <div className="topbar">
        <div>☰</div>

        <div className="logo">WildDex</div>

        <div>⚙</div>
      </div>

      {/* HOME */}
      {screen === "home" && (
        <div className="content">
          <div className="mapCard">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c5/Ph_regions_map.png"
              className="mapImg"
            />

            <h1>Philippine WildDex</h1>

            <p>Explore Philippine wildlife regions.</p>
          </div>

          <button
            className="regionBtn luzon"
            onClick={() => setScreen("luzon")}
          >
            🌿 Luzon Region
          </button>

          <button
            className="regionBtn visayas"
            onClick={() => setScreen("visayas")}
          >
            🌊 Visayas Region
          </button>

          <button
            className="regionBtn mindanao"
            onClick={() => setScreen("mindanao")}
          >
            🌴 Mindanao Region
          </button>

          <button
            className="cameraBtn"
            onClick={() => window.open("https://YOUR-VERCEL-LINK.vercel.app")}
          >
            📷 Open WildScan Camera
          </button>
        </div>
      )}

      {/* REGION PAGES */}
      {screen === "luzon" && renderAnimals("luzon")}

      {screen === "visayas" && renderAnimals("visayas")}

      {screen === "mindanao" && renderAnimals("mindanao")}

      {/* BOTTOM NAV */}
      <div className="bottomNav">
        <button onClick={() => setScreen("home")}>🏠</button>

        <button onClick={() => alert("🎒 Backpack System Coming Soon")}>
          🎒
        </button>

        <button
          onClick={() => window.open("https://YOUR-VERCEL-LINK.vercel.app")}
        >
          📷
        </button>

        <button onClick={() => alert("🛒 WildStore Coming Soon")}>🛒</button>

        <button onClick={() => alert("🛡 Clan System Coming Soon")}>🛡</button>
      </div>
    </div>
  );
}
