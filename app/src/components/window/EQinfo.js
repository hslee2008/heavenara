import { toDateDifference } from "../../utils/date";

import "../../css/disaster/eq.css";

function EQclass(magnitude) {
  if (magnitude <= 2.5) return "eq-1";
  else if (magnitude <= 5.4) return "eq-2";
  else if (magnitude <= 6.0) return "eq-3";
  else if (magnitude <= 6.9) return "eq-4";
  else if (magnitude <= 7.9) return "eq-5";
  else return "eq-6";
}

function EQinfo({ marker, openDialog, openMore }) {
  return (
    <div
      style={{
        width: "calc(100% + 1px)",
      }}
      className={`overlay-wrapper ${EQclass(marker.magnitude)}`}
    >
      <div onClick={openMore} className="overlay">
        <p className="location">{marker.location}</p>
        <p className="more">
          {toDateDifference(marker.date)}일 전 · {marker.magnitude} 규모
        </p>
        <p className="more">
          최대 진도 {marker.maxIntensity} · 깊이 {marker.depth}
        </p>
      </div>

      {marker.magnitude >= 2 && (
        <div className="button-wrapper">
          <button
            onClick={() =>
              openDialog("https://www.weather.go.kr/pews/man/m1.html")
            }
          >
            행동요령
          </button>
          {marker.more_info && !marker.more_info.includes("undefined") && (
            <button onClick={() => openDialog(marker.more_info)}>더보기</button>
          )}
        </div>
      )}
    </div>
  );
}

export default EQinfo;
