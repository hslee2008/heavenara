import { toDateDifference } from "../../utils/date";

import "../../css/disaster/ff.css";

function FFinfo({ marker, openDialog }) {
  return (
    <div
      className={`overlay-wrapper ${
        marker.tpStatus === "진화중" && "trying-to-put-out"
      }`}
    >
      <div className="overlay">
        <p className="location">
          {marker.loc.split(" ").slice(0, 2).join(" ")}
        </p>
        <p className="more">{marker.loc.split(" ").slice(2).join(" ")}</p>
        <p className="more">
          {toDateDifference(marker.mapTime)}일 전 · {marker.tpStatus}
        </p>
      </div>
      <div className="button-wrapper">
        <button
          onClick={() =>
            openDialog(
              "https://www.safekorea.go.kr/idsiSFK/neo/sfk/cs/contents/prevent/SDIJKM5117.html?menuSeq=127"
            )
          }
        >
          행동요령
        </button>
      </div>
    </div>
  );
}

export default FFinfo;
