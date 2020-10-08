const axios = require("axios");

axios
  .get(
    "https://www.berlin.de/lageso/gesundheit/infektionsepidemiologie-infektionsschutz/corona/tabelle-bezirke-gesamtuebersicht/index.php/index/all.json?q="
  )
  .then((res) => {
    let rate = 0;
    for (let i = res.data.index.length - 7; i < res.data.index.length; i++) {
      console.log(res.data.index.length - i);
      let count =
        parseInt(res.data.index[i].mitte) +
        parseInt(res.data.index[i].friedrichshain_kreuzberg) +
        parseInt(res.data.index[i].pankow) +
        parseInt(res.data.index[i].charlottenburg_wilmersdorf) +
        parseInt(res.data.index[i].spandau) +
        parseInt(res.data.index[i].steglitz_zehlendorf) +
        parseInt(res.data.index[i].tempelhof_schoeneberg) +
        parseInt(res.data.index[i].neukoelln) +
        parseInt(res.data.index[i].treptow_koepenick) +
        parseInt(res.data.index[i].marzahn_hellersdorf) +
        parseInt(res.data.index[i].lichtenberg) +
        parseInt(res.data.index[i].reinickendorf);
      rate += count;
    }
    console.log(rate);
    rate = rate / 3769000; // divide by inhabitants
    rate = rate * 100000; // multiply by 100000 to get the 7-day-incident rate
    console.log(rate);
  });