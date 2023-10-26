import { useKakaoLoader, Map, MapMarker } from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";

import { toDateDifference } from "./utils/date";

import "./css/App.css";

function App() {
  const [appLoading, setAppLoading] = useState(true);
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
    fetch("https://heavenara.cyclic.app/scrape-earthquake-weathergov")
      .then((res) => res.json())
      .then((res) => {
        for (let i = 0; i < res.length; i++) {
          const {
            date,
            magnitude,
            depth,
            latitude,
            longitude,
            location,
            map_pic,
            more_info,
          } = res[i];

          setMarkers((markers) => [
            ...markers,
            {
              lat: latitude,
              lng: longitude,
              location: location,
              date: date,
              link: "https://www.weather.go.kr/" + map_pic,
              more_info: "https://www.weather.go.kr/" + more_info,
              magnitude: magnitude,
              depth: depth,
            },
          ]);

          if (i === res.length - 1) setAppLoading(false);
        }
      });
  }, []);

  if (appLoading || loading)
    return (
      <div className="spinner-wrapper">
        <ReactLoading type="spin" color="skyblue" height={300} width={300} />
      </div>
    );
  if (process.env.NODE_ENV === "production" && error)
    return (
      <div className="spinner-wrapper">
        <h1>unknown error</h1>
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
              size: { width: 30, height: 35 },
            }}
            onClick={() => window.open(marker.link)}
          >
            <div className="overlay-wrapper">
              <div onClick={() => window.open(marker.link)} className="overlay">
                <p className="location">{marker.location}</p>
                <p className="date">{toDateDifference(marker.date)}일 전</p>
              </div>

              <div className="magnitude-wrapper">
                <p className="magnitude">{marker.magnitude} 규모</p>
              </div>

              {marker.magnitude > 2.5 && (
                <div className="button-wrapper">
                  <button
                    onClick={() =>
                      window.open(
                        "https://www.safekorea.go.kr/idsiSFK/neo/sfk/cs/contents/prevent/prevent09.html?menuSeq=126"
                      )
                    }
                  >
                    행동요령
                  </button>
                  {marker.more_info &&
                    marker.more_info !==
                      "https://www.weather.go.kr/undefined" && (
                      <button onClick={() => window.open(marker.more_info)}>
                        더보기
                      </button>
                    )}
                </div>
              )}
            </div>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}

export default App;
