let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    sorteerBoekObj.data = JSON.parse(this.responseText);
    sorteerBoekObj.voegjsdatumin();
    sorteerBoekObj.sorteren();
  }
};

xmlhttp.open("GET", "boeken.json", true);
xmlhttp.send();
const maaktabelkop = arr => {
  let kop = "<table class='boekSelectie'><tr>";
  arr.forEach(item => {
    kop += "<th>" + item + "</th>";
  });
  kop += "</tr>";
  return kop;
};

const maaktabelrij = (arr, accent) => {
  let rij = "";
  if (accent == true) {
    rij = "<tr class='boekselectierijaccent'>";
  } else {
    rij = "<tr class='boekselectierij'>";
  }
  arr.forEach(item => {
    rij += "<td class='boekselectiedatacel'>" + item + "</td>";
  });
  rij += "</tr>";
  return rij;
};

const geefmaandnummer = maand => {
  let nummer;
  switch (maand) {
    case "januari":
      nummer = 0;
      break;
    case "februari":
      nummer = 1;
      break;
    case "maart":
      nummer = 2;
      break;
    case "april":
      nummer = 3;
      break;
    case "mei":
      nummer = 4;
      break;
    case "juni":
      nummer = 5;
      break;
    case "juli":
      nummer = 6;
      break;
    case "augustus":
      nummer = 7;
      break;
    case "september":
      nummer = 8;
      break;
    case "oktober":
      nummer = 9;
      break;
    case "november":
      nummer = 10;
      break;
    case "december":
      nummer = 11;
      break;
    default:
      nummer = 0;
  }
  return nummer;
};

const maakjsdatum = maandJaar => {
  let mjArray = maandJaar.split(" ");
  let datum = new Date(mjArray[1], geefmaandnummer(mjArray[0]));
  return datum;
};

const maakopsomming = array => {
  let string = "";
  for (let i = 0; i < array.length; i++) {
    switch (i) {
      case array.length - 1:
        string += array[i];
        break;
      case array.length - 2:
        string += array[i] + " en ";
        break;
      default:
        string += array[i] + ", ";
    }
  }
  return string;
};

let sorteerBoekObj = {
  data: "",

  kenmerk: "titel",

  oplopend: 1,

  voegjsdatumin: function() {
    this.data.forEach(item => {
      item.jsDatum = maakjsdatum(item.uitgave);
    });
  },

  sorteren: function() {
    this.data.sort((a, b) =>
      a[this.kenmerk] > b[this.kenmerk] ? 1 * this.oplopend : -1 * this.oplopend
    );
    this.uitvoeren(this.data);
  },

  uitvoeren: function(data) {
    let uitvoer = maaktabelkop([
      "titel",
      "auteur(s)",
      "cover",
      "uitgave",
      "pagina's",
      "taal",
      "EAN"
    ]);
    for (let i = 0; i < data.length; i++) {
      let accent = false;
      i % 2 == 0 ? (accent = true) : (accent = false);
      let imgElement =
        "<img src='" +
        data[i].cover +
        "' class='boekselectiecover' alt='" +
        data[i].titel +
        "'>";
      let auteurs = maakopsomming(data[i].auteur);
      uitvoer += maaktabelrij(
        [
          data[i].titel,
          auteurs,
          imgElement,
          data[i].uitgave,
          data[i].paginas,
          data[i].taal,
          data[i].ean
        ],
        accent
      );
    }

    document.getElementById("uitvoer").innerHTML = uitvoer;
  }
};

let kenmerk = document.getElementById("kenmerk");
kenmerk.addEventListener("change", e => {
  sorteerBoekObj.kenmerk = e.target.value;
  sorteerBoekObj.sorteren();
});

document.getElementsByName("oplopend").forEach(item => {
  item.addEventListener("click", e => {
    sorteerBoekObj.oplopend = parseInt(e.target.value);
    sorteerBoekObj.sorteren();
  });
});
