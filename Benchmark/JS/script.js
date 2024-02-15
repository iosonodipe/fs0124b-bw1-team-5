// fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy")
//   .then((response) => response.json())
//   .then((dati) => {
//     let domande = dati.results;
//   });

//----------------------------------VARIABILI GLOBALI----------------------------------
let punteggio = 6;

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
  calcoloPercentualeCorrette(clone);
  calcoloPercentualeErrate(clone);
  eventoBottoneRateUs(clone);
}

//funzione cambio pagina (riempimento iframe con html)
function cambioPagina() {
  console.log(iframe.src);
  switch (iframe.src) {
    case "http://127.0.0.1:5500/Benchmark/welcome.html":
      iframe.src = "http://127.0.0.1:5500/Benchmark/test.html";
      break;
    case "http://127.0.0.1:5500/Benchmark/test.html":
      iframe.src = "http://127.0.0.1:5500/Benchmark/results.html";
      break;
    case "http://127.0.0.1:5500/Benchmark/results.html":
      iframe.src = "http://127.0.0.1:5500/Benchmark/welcome.html";
      //modificare src con review
  }
  iframe.location.href.reload()
  dynamicContainer.innerHTML = ''
  iframe.onload = riempimentoDynamicContainer
}

// let bottoneProceed = iframe.contentDocument.querySelector("#proceed");
// let bottoneProceed = document.querySelector("#proceed");
// bottoneProceed.addEventListener('mouseup', cambioPagina)

//----------------------------------FUNZIONI DI PAGINA----------------------------------

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
