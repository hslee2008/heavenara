function returnEQ(marker) {
  // only after 10 index
  let title = marker.title.slice(10);

  return `
  
    <div style="" class="overlay">
      <a href="${marker.link}">
        <p class="title">${title}</p>
        <p class="time">${marker.time}</p>
      </a>
      
      <a href="https://www.safekorea.go.kr/idsiSFK/neo/sfk/cs/contents/prevent/prevent09.html?menuSeq=126">
        <p>행동요령</p>
      </a>
    </div>
  
  `;
}
