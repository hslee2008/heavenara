function parseEQTitle(title) {
  const titleList = title.split(" ");
  const toReturn = [];

  for (let i = 0; i < titleList.length; i++) {
    if (
      !titleList[i].includes("쪽") &&
      !titleList[i].includes("역서") &&
      !titleList[i].includes("발생")
    ) {
      toReturn.push(titleList[i]);
    }
  }

  return toReturn.join(" ");
}

export { parseEQTitle };
