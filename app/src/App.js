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
    fetch("https://heavenara.cyclic.app/scrape-earthquake")
      .then((res) => res.json())
      .then((res) => {
        let averageArray = [];

        for (let i = 0; i < res.length; i++) {
          if (res[i].area || !res[i].info?.longitude) {
            const si = res[i].area?.split(" ")[1];

            const box = polygon.features.find((feature) => {
              return feature.properties.sggnm.includes(si);
            });

            if (!box) continue;

            const coords = box.geometry.coordinates[0][0];
            let averageLNG = 0;
            let averageLAT = 0;

            for (let i = 0; i < coords.length; i++) {
              averageLNG += coords[i][0];
              averageLAT += coords[i][1];
            }

            averageLNG /= coords.length;
            averageLAT /= coords.length;

            averageArray.push({ lat: averageLAT, lng: averageLNG });

            setCoordData([...coordData, { ...res[i] }]);

            continue;
          }

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

          setCoordAverage(averageArray);

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
