const axios = require("axios");

axios
  .get(
    "https://www.berlin.de/lageso/gesundheit/infektionsepidemiologie-infektionsschutz/corona/tabelle-bezirke-gesamtuebersicht/index.php/index/all.json?q="
  )
  .then((res) => {
    console.log(res.data.index[res.data.index.length - 1]);
  });
