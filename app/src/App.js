import { useKakaoLoader, Map, MapMarker } from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import "./css/App.css";

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

          const title = res[i].title;
          const source = res[i].source;
          const time = res[i].time;
          const link = res[i].link;

          setMarkers((markers) => [
            ...markers,
            { lat: latitude, lng: longitude, title, source, time, link },
          ]);

          setMarkers((markers) => {
            const seen = new Set();
            const filteredArr = markers.filter((el) => {
              const duplicate = seen.has(el.lat + el.lng);
              seen.add(el.lat + el.lng);
              return !duplicate;
            });
            return filteredArr;
          });
        }
      });
  }, []);

  if (loading)
    return (
      <div className="spinner-wrapper">
        <ReactLoading type="spin" color="skyblue" height={300} width={300} />
      </div>
    );

  return (
    <div className="App">
      <Map
        center={{ lat: lat, lng: lng }}
        style={{ width: "100%", height: "100vh" }}
        level={12}
      >
        <MapMarker position={{ lat: lat, lng: lng }}></MapMarker>

        {markers.map((marker, index) => (
          <MapMarker
            clickable
            position={{ lat: marker.lat, lng: marker.lng }}
            key={`${marker.lat}/${marker.lng}/${index}`}
            image={{
              src: "/img/earthquake.png",
              size: { width: 40, height: 45 },
            }}
            onClick={() => window.open(marker.link)}
          >
            <div onClick={() => window.open(marker.link)} className="overlay">
              <p className="title">{marker.title?.slice(7)}</p>
              <p className="time">{marker.time}</p>
            </div>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}

export default App;
