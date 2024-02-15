fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy")
  .then((response) => response.json())
  .then((dati) => {
    let domande = dati.results;

    let punteggio = 5;

    // function calcoloPercentualeCorrette() {
    //   let percentualeGiuste = document.querySelector('#percentualeCorrette')
    //   console.log(percentualeGiuste);
    //   percentualeGiuste.innerText((punteggio/10)*100)
    //   console.log(percentualeGiuste.innerText);
    // }

    // calcoloPercentualeCorrette()
  });

//variabili globali

//SELETTORI GLOBALI
let iframe = document.querySelector("iframe");

iframe.onload = function () {
  const oldNode = iframe.contentWindow.document.getElementById("content");
  let dynamicContainer = document.querySelector(".dynamic-container");
  let clone = document.importNode(oldNode, true);
  dynamicContainer.append(clone);
};


//FUNZIONI

//funzione cambio pagina (riempimento iframe con html)
function cambioPagina() {
  switch (iframe.src) {
    case "./welcome.html":
      iframe.src = "./test.html";
      break;
    case "./test.html":
      iframe.src = "./results.html";
      break;
    case "./results.html":
      iframe.src = "./review.html";
      break;
  }
}

// let bottoneProceed = iframe.contentDocument.querySelector("#proceed");
// let bottoneProceed = document.querySelector("#proceed");
// console.log(bottoneProceed);
// bottoneProceed.addEventListener('click', cambioPagina)
