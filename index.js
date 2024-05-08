const express = require("express");
const axios = require("axios")
const path = require("path");
const dotenv = require("dotenv");



const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

dotenv.config();


const port = process.env.PORT || 3000;

app.get("/", function (req, res) {
  res.render("index", { translation: null, error: null });
});

app.post("/translate", async function (req, res) {
  const { textInput, targetLang } = req.body;
  const options = {
    method: 'POST',
    url: 'https://deep-translate1.p.rapidapi.com/language/translate/v2',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com'
    },
    data: {
      q: textInput,
      source: 'auto',
      target: targetLang
    }
  };
  try {
    const response = await axios.request(options);
    if(response.status == 200) {
      res.render("index", {
        translation: response.data.data?.translations?.translatedText,
        error: null,
      });
    }else{
      res.render("index", {
        translation: null,
        error: "Translation can not be processed"
      })
    }   
  } catch (e) {
    res.render("index", {
      translation: null,
      error: "Error occurred, please try again",
    });
  }
});



app.listen(port, function () {
  console.log(`server is running on ${port}`);
});
