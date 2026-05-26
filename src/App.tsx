import "./styles.css";

function App() {
  const openScanner = () => {
    window.open("https://ancient-cherry.vercel.app", "_blank");
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

        {/* SCANNER BUTTON */}
        <button className="scannerOrb" onClick={openScanner}></button>

        <h1>PHILIPPINE POKÉDEX</h1>

        <p>AI-powered wildlife scanner inspired by classic Pokédex systems.</p>
      </div>

      {/* SCANNER BUTTON BIG */}
      <button className="scanButton" onClick={openScanner}>
        📷 OPEN WILDSCAN
      </button>

      {/* LUZON */}
      <h2 className="regionTitle">🌿 Luzon Region</h2>

      <div className="cards-container">
        {/* EAGLE */}
        <div className="animal-card">
          <img src="eagle.jpg" alt="Philippine Eagle" />

          <div className="card-content">
            <h2>#001 Philippine Eagle</h2>

            <div className="tags">
              <span className="type flying">Flying</span>

              <span className="rarity legendary">Legendary</span>
            </div>

            <p>
              A massive sky predator known for its terrifying eyesight and
              immense wingspan.
            </p>
          </div>
        </div>

        {/* TAMARAW */}
        <div className="animal-card">
          <img src="tamaraw.jpg" alt="Tamaraw" />

          <div className="card-content">
            <h2>#002 Tamaraw</h2>

            <div className="tags">
              <span className="type ground">Ground</span>
            </div>

            <p>
              This rare beast roams the mountains of Mindoro with unmatched
              endurance.
            </p>
          </div>
        </div>
      </div>

      {/* VISAYAS */}
      <h2 className="regionTitle">🌊 Visayas Region</h2>

      <div className="cards-container">
        {/* TARSIER */}
        <div className="animal-card">
          <img src="tarsier.jpg" alt="Tarsier" />

          <div className="card-content">
            <h2>#003 Tarsier</h2>

            <div className="tags">
              <span className="type flying">Forest</span>
            </div>

            <p>
              A tiny nocturnal primate with giant glowing eyes and incredible
              jumping ability.
            </p>
          </div>
        </div>

        {/* WHALE SHARK */}
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
        {/* DUGONG */}
        <div className="animal-card">
          <img src="dugong.jpg" alt="Dugong" />

          <div className="card-content">
            <h2>#005 Dugong</h2>

            <div className="tags">
              <span className="type ground">Water</span>
            </div>

            <p>A peaceful marine mammal related to manatees.</p>
          </div>
        </div>

        {/* CROCODILE */}
        <div className="animal-card">
          <img src="crocodile.jpg" alt="Philippine Crocodile" />

          <div className="card-content">
            <h2>#006 Philippine Crocodile</h2>

            <div className="tags">
              <span className="type ground">Reptile</span>

              <span className="rarity legendary">Rare</span>
            </div>

            <p>One of the rarest crocodile species in the world.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
