import {
  useKakaoLoader,
  Map,
  MapMarker,
  MarkerClusterer,
} from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import polygon from "./polygon.json";

import { parseEQTitle } from "./utils/parse";

import "./css/App.css";

function App() {
  const [appLoading, setAppLoading] = useState(true);
  const [loading, error] = useKakaoLoader({
    appkey: "6072e8a0344039acacc746c3c35906fb",
  });
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [markers, setMarkers] = useState([]);
  const [coordAverage, setCoordAverage] = useState([]);
  const [coordData, setCoordData] = useState([]);

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
            map_pic
          } = res[i]
          
          
          if (i === res.length - 1) setAppLoading(false);
        }
      });
  }, [coordData]);

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

        <MarkerClusterer
          averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
          minLevel={10} // 클러스터 할 최소 지도 레벨
        >
          {coordAverage.map((average, index) => (
            <MapMarker
              clickable
              position={{ lat: average.lat, lng: average.lng }}
              key={`${average.lat}/${average.lng}/${index}`}
              image={{
                src: "/img/earthquake.png",
                size: { width: 40, height: 45 },
              }}
            >
              <div className="overlay-wrapper">
                <div
                  onClick={() => window.open(coordData[index].link)}
                  className="overlay"
                >
                  <p className="title">
                    {parseEQTitle(coordData[index].title?.slice(7))}
                  </p>
                  <p className="time">{coordData[index].time}</p>
                </div>

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
                </div>
              </div>
            </MapMarker>
          ))}

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
              <div className="overlay-wrapper">
                <div
                  onClick={() => window.open(marker.link)}
                  className="overlay"
                >
                  <p className="title">
                    {parseEQTitle(marker.title?.slice(7))}
                  </p>
                  <p className="time">{marker.time}</p>
                </div>

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
                </div>
              </div>
            </MapMarker>
          ))}
        </MarkerClusterer>
      </Map>
    </div>
  );
}

export default App;
