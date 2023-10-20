const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const REGEX = require("./regex.js");

const app = express();
app.use(cors());

/* Scrape Earthquake News */
function Match(text, regex, index) {
  const matches = text.match(regex);

  if (matches) {
    return matches[index];
  }

  return null;
}

function locTOnumb(loc) {
  const locArr = loc.split(" ");
  const locNum = locArr[0];

  return locNum;
}

app.get("/scrape-earthquake", async (req, res) => {
  let news = [];

  try {
    const response = await axios.get(
      "https://search.naver.com/search.naver?where=news&query=%EC%86%8D%EB%B3%B4%20%EC%A7%80%EC%A7%84&sm=tab_opt&sort=1&photo=0&field=0&pd=4&ds=2023.10.19.20.42&de=2023.10.20.20.42&docid=&related=0&mynews=0&office_type=0&office_section_code=0&news_office_checked=&nso=so%3Add%2Cp%3A1d&is_sug_officeid=0&office_category=0&service_area=0"
    );
    const $ = cheerio.load(response.data);

    const $newsList = $(".list_news > li");

    $newsList.each((index, child) => {
      const source = $(child).find(".info_group > a").attr("href");
      const time = $(child).find(".info_group > .info").text();
      const link = $(child).find(".news_contents > .dsc_thumb").attr("href");
      const title = $(child).find(".news_contents > .news_tit").attr("title");
      const description = $(child).find(".dsc_wrap > a").text();

      const date = Match(description, REGEX.date, 0);
      const location = Match(description, REGEX.location, 0);
      const magnitude = Match(description, REGEX.magnitude, 0);
      const latitude = locTOnumb(Match(description, REGEX.latitude, 1));
      const longitude = locTOnumb(Match(description, REGEX.longitude, 1));

      news.push({
        source,
        time,
        link,
        title,
        description,
        info: {
          date,
          location,
          magnitude,
          latitude,
          longitude,
        },
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }

  res.json(news);
});
/* Scrape Earthquake News*/

/* Scrape Strong Wind News */
app.get("/scrape-strongwind", async (req, res) => {
  let news = [];

  try {
    const response = await axios.get(
      "https://m.search.naver.com/search.naver?sm=mtb_hty.top&where=m&oquery=%EC%9E%AC%EB%82%9C%EB%AC%B8%EC%9E%90&tqi=ig6dWdprfShssL4f9dKssssstBh-115609&query=%EC%9E%AC%EB%82%9C%EB%AC%B8%EC%9E%90+%EA%B0%95%ED%92%8D"
    );
    const $ = cheerio.load(response.data);

    const $newsList = $(".disaster_list > li");

    $newsList.each((index, child) => {
      const text = $(child).find(".disaster_text").text();
      const area = $(child).find(".info_box > .area").text();
      const date = $(child).find(".info_box > .date").text();
      const howtoactlink = $(child).find(".disaster_info > a").attr("href");

      news.push({
        text,
        area,
        date,
        howtoactlink,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }

  res.json(news);
});
/* Scrape Strong Wind News*/


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});