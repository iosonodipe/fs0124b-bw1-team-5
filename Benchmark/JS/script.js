fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy")
  .then((response) => response.json())
  .then((dati) => {
    let domande = dati.results;
  });

//----------------------------------VARIABILI GLOBALI----------------------------------
let punteggio = 6;
let difficoltà; //value input welcome
let numeroDomande; //value input welcome

//----------------------------------SELETTORI GLOBALI----------------------------------
let iframe = document.querySelector("iframe");
let dynamicContainer = document.querySelector(".dynamic-container");

//----------------------------------FUNZIONI GLOBALI----------------------------------

//funzione che aspetta riempimento di iframe per poi andare a ricavare il contenuto di esso e appenderlo al container dell'index

iframe.onload = riempimentoDynamicContainer;

function riempimentoDynamicContainer() {
  const oldNode = iframe.contentWindow.document.getElementById("content");
  let clone = document.importNode(oldNode, true);
  dynamicContainer.append(clone);
  //aggiunere if per stabilire scatenamento funzioni in base alla iframe.src
  switch (iframe.src) {
    case "http://127.0.0.1:5500/Benchmark/welcome.html":
      eventoBottoneProceed(clone);
      break;
    case "http://127.0.0.1:5500/Benchmark/test.html":
      break;
    case "http://127.0.0.1:5500/Benchmark/results.html":
      calcoloPercentualeCorrette(clone);
      calcoloPercentualeErrate(clone);
      eventoBottoneRateUs(clone);
      break;
    case "http://127.0.0.1:5500/Benchmark/review.html":
      selezionaStelle();
  }
}

//funzione cambio pagina (riempimento iframe con html)
function cambioPagina() {
  switch (iframe.src) {
    case "http://127.0.0.1:5500/Benchmark/welcome.html":
      iframe.contentWindow.location.reload();
      iframe.src = "http://127.0.0.1:5500/Benchmark/test.html";
      break;
    case "http://127.0.0.1:5500/Benchmark/test.html":
      iframe.contentWindow.location.reload();
      iframe.src = "http://127.0.0.1:5500/Benchmark/results.html";
      break;
    case "http://127.0.0.1:5500/Benchmark/results.html":
      iframe.contentWindow.location.reload();
      iframe.src = "http://127.0.0.1:5500/Benchmark/review.html";
    //modificare src con review
  }
  // iframe.contentWindow.location.reload()
  // iframe.location.href.reload()
  dynamicContainer.innerHTML = "";
  iframe.onload = riempimentoDynamicContainer;
}

//----------------------------------FUNZIONI DI PAGINA----------------------------------

//welcome page
function eventoBottoneProceed(clone) {
  let bottoneProceed = clone.querySelector("#proceed");
  bottoneProceed.addEventListener("mouseup", cambioPagina);
}

//result page
function calcoloPercentualeCorrette(clone) {
  let percentualeGiuste = clone.querySelector("#percentualeCorrette");
  percentualeGiuste.innerText = (punteggio / 10) * 100 + "%";
  let risposteGiuste = clone.querySelector("#risposteCorrette");
  risposteGiuste.innerText = punteggio + "/10 questions";
  let esitoEsame = clone.querySelector("#esitoEsame");
  let esitoDescrizione = clone.querySelector("#esitoDescrizione");
  let esitoTesto = clone.querySelector("#esitoTesto");
  if (punteggio < 6) {
    esitoEsame.innerText = "I'm sorry";
    esitoDescrizione.innerText = "You didn't pass the exam.";
    esitoTesto.innerText = "You can try the test again in an hour.";
  }
  let root = document.querySelector(":root");
  root.style.setProperty("--punteggio", (10 - punteggio) * 10);
}

function calcoloPercentualeErrate(clone) {
  let percentualeErrate = clone.querySelector("#percentualeErrate");
  percentualeErrate.innerText = ((10 - punteggio) / 10) * 100 + "%";
  let risposteErrate = clone.querySelector("#risposteErrate");
  risposteErrate.innerText = 10 - punteggio + "/10 questions";
}

function eventoBottoneRateUs(clone) {
  let bottoneRateUs = clone.querySelector(".btn");
  bottoneRateUs.addEventListener("mouseup", cambioPagina);
}

//review page

function selezionaStelle() {
  const stars = document.querySelectorAll(".logo-button");
  let rating = 0;

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      if (index === rating - 1) {
        rating = 0;
      } else {
        rating = index + 1;
      }
      updateStars();
      console.log("Valutazione:", rating);
    });

    star.addEventListener("mouseenter", () => {
      for (let i = 0; i <= index; i++) {
        stars[i].classList.add("selected");
      }
    });

    star.addEventListener("mouseleave", () => {
      if (rating === 0) {
        stars.forEach((star) => star.classList.remove("selected"));
      }
    });
  });
}

function updateStars() {
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add("selected");
    } else {
      star.classList.remove("selected");
    }
  });
}
