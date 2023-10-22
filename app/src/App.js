import { useKakaoLoader, Map, MapMarker } from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";
import "./App.css";

import { returnEQ } from "./utils/overlay.js";

function App() {
  const [loading, error] = useKakaoLoader({
    appkey: "6072e8a0344039acacc746c3c35906fb",
  });
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [markers, setMarkers] = useState([]);

  function init(position) {
    setLat(position.coords.latitude);
    setLng(position.coords.longitude);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(init);

    // scrape earthquake
    fetch("https://heavenara.onrender.com/scrape-earthquake")
      .then((res) => res.json())
      .then((res) => {
        for (let i = 0; i < res.length; i++) {
          const longitude = parseFloat(res[i].info.longitude);
          const latitude = parseFloat(res[i].info.latitude);

          setMarkers((markers) => [
            ...markers,
            { lat: latitude, lng: longitude, text: returnEQ(res[i]) },
          ]);
        }
      });
  });

  return (
    <div className="App">
      <Map
        center={{ lat: lat, lng: lng }}
        style={{ width: "100%", height: "100vh" }}
      >
        <MapMarker position={{ lat: lat, lng: lng }}></MapMarker>
        {markers.map((marker, index) => (
          <MapMarker position={{ lat: marker.lat, lng: marker.lng }}></MapMarker>
        ))}
      </Map>
    </div>
  );
}

export default App;
