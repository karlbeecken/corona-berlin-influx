const axios = require("axios");
const os = require("os");
const Influx = require("influx");

axios
  .get(
    "https://www.berlin.de/lageso/gesundheit/infektionskrankheiten/corona/tabelle-bezirke-gesamtuebersicht/index.php/index/all.json?q="
  )
  .then((res) => {
    let rate = 0;

    console.log(res.data);

    let districts = {
      mitte: {
        rate: 0,
        geohash: "u33dbbmef8k1",
        name: "Mitte",
        inhabitants: 385748,
      },
      friedrichshain_kreuzberg: {
        rate: 0,
        geohash: "u33d9tmfem74",
        name: "Friedrichshain-Kreuzberg",
        inhabitants: 290386,
      },
      pankow: {
        rate: 0,
        geohash: "u33e0cz5yrjj",
        name: "Pankow",
        inhabitants: 409335,
      },
      charlottenburg_wilmersdorf: {
        rate: 0,
        geohash: "u336wm1u1n0p",
        name: "Charlottenburg-Wilmersdorf",
        inhabitants: 343592,
      },
      spandau: {
        rate: 0,
        geohash: "u336ge7sve49",
        name: "Spandau",
        inhabitants: 245197,
      },
      steglitz_zehlendorf: {
        rate: 0,
        geohash: "u336m90q73sn",
        name: "Steglitz-Zehlendorf",
        inhabitants: 310071,
      },
      tempelhof_schoeneberg: {
        rate: 0,
        geohash: "u33d2x32qr87",
        name: "Tempelhof-Schöneberg",
        inhabitants: 350984,
      },
      neukoelln: {
        rate: 0,
        geohash: "u33dd43cxdqu",
        name: "Neukölln",
        inhabitants: 329917,
      },
      treptow_koepenick: {
        rate: 0,
        geohash: "u33dksnzqk8j",
        name: "Treptow-Köpenick",
        inhabitants: 273689,
      },
      marzahn_hellersdorf: {
        rate: 0,
        geohash: "u33dvhef09tm",
        name: "Marzahn-Hellersdorf",
        inhabitants: 269967,
      },
      lichtenberg: {
        rate: 0,
        geohash: "u33dg5qkug19",
        name: "Lichtenberg",
        inhabitants: 294201,
      },
      reinickendorf: {
        rate: 0,
        geohash: "u337pc3pj8cq",
        name: "Reinickendorf",
        inhabitants: 266408,
      },
    };

    for (let i = 0; i < 7; i++) {
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
      console.log(count);
      rate += count;
      districts.mitte.rate += parseInt(res.data.index[i].mitte);
      districts.friedrichshain_kreuzberg.rate += parseInt(
        res.data.index[i].friedrichshain_kreuzberg
      );
      districts.pankow.rate += parseInt(res.data.index[i].pankow);
      districts.charlottenburg_wilmersdorf.rate += parseInt(
        res.data.index[i].charlottenburg_wilmersdorf
      );
      districts.spandau.rate += parseInt(res.data.index[i].spandau);
      districts.steglitz_zehlendorf.rate += parseInt(
        res.data.index[i].steglitz_zehlendorf
      );
      districts.tempelhof_schoeneberg.rate += parseInt(
        res.data.index[i].tempelhof_schoeneberg
      );
      districts.neukoelln.rate += parseInt(res.data.index[i].neukoelln);
      districts.treptow_koepenick.rate += parseInt(
        res.data.index[i].treptow_koepenick
      );
      districts.marzahn_hellersdorf.rate += parseInt(
        res.data.index[i].marzahn_hellersdorf
      );
      districts.lichtenberg.rate += parseInt(res.data.index[i].lichtenberg);
      districts.reinickendorf.rate += parseInt(res.data.index[i].reinickendorf);
    }
    rate = rate / 3769000; // divide by inhabitants
    rate = rate * 100000; // multiply by 100000 to get the 7-day-incident rate
    console.log("7 day incident rate: " + rate);

    const influx = new Influx.InfluxDB({
      host: "localhost",
      database: "corona",
      schema: [
        {
          measurement: "corona-7-day-incidents-berlin",
          fields: {
            rate: Influx.FieldType.FLOAT,
            geohash: Influx.FieldType.STRING,
            name: Influx.FieldType.STRING,
          },
          tags: ["host", "geohash", "district"],
        },
      ],
    });

    influx.writePoints([
      {
        measurement: "corona-7-day-incidents-berlin",
        tags: {
          host: os.hostname(),
          geohash: "u33d8vx6ubk2",
          district: "berlin",
        },
        fields: { rate: rate, geohash: "u33d8vx6ubk2", name: "Berlin" },
      },
    ]);

    for (district in districts) {
      const influx = new Influx.InfluxDB({
        host: "localhost",
        database: "corona",
        schema: [
          {
            measurement: `corona-7-day-incidents-berlin`,
            fields: {
              rate: Influx.FieldType.FLOAT,
              geohash: Influx.FieldType.STRING,
              name: Influx.FieldType.STRING,
            },
            tags: ["host", "geohash", "district"],
          },
        ],
      });

      influx.writePoints([
        {
          measurement: `corona-7-day-incidents-berlin`,
          tags: {
            host: os.hostname(),
            geohash: districts[district].geohash,
            district: district,
          },
          fields: {
            rate:
              (districts[district].rate / districts[district].inhabitants) *
              100000,
            geohash: districts[district].geohash,
            name: districts[district].name,
          },
        },
      ]);

      console.log(
        district +
          ": " +
          districts[district].rate +
          " " +
          (districts[district].rate / districts[district].inhabitants) * 100000
      );
    }
  });
