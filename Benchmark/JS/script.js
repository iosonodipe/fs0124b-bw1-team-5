

//----------------------------------VARIABILI GLOBALI----------------------------------
let punteggio = 0;
let difficoltà; //value input welcome
let numeroDomande; //value input welcome
let domande = [];
let tempoRimanente = 60; // Tempo rimanente per rispondere a ogni domanda
let intervalloTimer; // Variabile per l'intervallo del timer

//----------------------------------SELETTORI GLOBALI----------------------------------
let iframe = document.querySelector("iframe");
let dynamicContainer = document.querySelector(".dynamic-container");

//----------------------------------FUNZIONI GLOBALI----------------------------------

//funzione che scatena il fetch
function caricamentoDomande() {
  fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy")
      .then((response) => response.json())
      .then((dati) => {
          domande = dati.results; // Salva le domande nell'array globale
          iniziaQuiz(); // Avvia il quiz quando le domande sono state caricate
      })
      .catch((error) => {
          console.log("Si è verificato un errore nel caricamento delle domande:", error);
      });
}

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
      caricamentoDomande();
      // Aggiungi un gestore per il clic sui pulsanti di risposta
      document.getElementById('risposte-container').addEventListener('click', function(event) {
      selezionaRisposta(event);
});
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

//test page

// Funzione per avviare il quiz - viene richiamata da CaricamentoDomande
function iniziaQuiz() {
  // Avvia il timer per la prima domanda
  startTimer();
  // Mostra la prima domanda
  mostraDomanda();
}

// Funzione per mostrare una domanda - viene richiamata in iniziaQuiz
function mostraDomanda() {
  // Controlla se ci sono ancora domande rimanenti
  if (domande.length === 0) {
      // Se non ci sono più domande, mostra il risultato finale
      mostraRisultato();
      return;
  }

  // Prendi la prima domanda dall'array
  let domandaCorrente = domande.pop();

  // Mescola le risposte, includendo la risposta corretta
  let risposteMescolate = domandaCorrente.incorrect_answers.concat(domandaCorrente.correct_answer);
  risposteMescolate = mescolaArray(risposteMescolate);

  // Aggiorna il contenuto della domanda nel documento HTML
  document.getElementById('domanda').innerText = domandaCorrente.question;

  // Rimuovi le risposte precedenti
  document.getElementById('risposte-container').innerHTML = '';

  // Crea e aggiungi i pulsanti di risposta
  risposteMescolate.forEach(risposta => {
      let button = createButton(risposta);
      document.getElementById('risposte-container').appendChild(button);
  });
}

// Funzione per mostrare il risultato finale - viene richiamata in mostraDomanda
function mostraRisultato() {
  // Nascondi il contenitore del quiz
  document.getElementById("quiz-container").style.display = "none";

  // Crea un elemento per mostrare il risultato
  let resultElement = document.createElement('div');
  resultElement.id = 'result';
  resultElement.innerText = "Hai risposto correttamente a " + punteggio + " domande su 10.";

  // Aggiungi il risultato al documento
  document.body.appendChild(resultElement);
}

// Funzione per mescolare un array - viene richiamata in mostraDomanda
function mescolaArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Funzione per creare un bottone con uno stile simile ai bottoni nel markup HTML - viene richiamata in mostraDomanda
function createButton(text) {
  let button = document.createElement('button');
  button.className = 'bottone';
  button.type = 'button';
  button.innerText = text;
  return button;
}

// Funzione chiamata quando l'utente seleziona una risposta
function selezionaRisposta(event) {
  // aggiungere if se non c'e un evento
  let rispostaSelezionata = event.target.innerText;
  if (rispostaSelezionata === domande[domande.length - 1].correct_answer) {
      punteggio++; // Incrementa il punteggio se la risposta è corretta
  }
  clearInterval(intervalloTimer); // Interrompi il timer quando l'utente risponde a una domanda
  mostraDomanda(); // Passa alla prossima domanda
  startTimer(); // Avvia il timer per la nuova domanda
}

// Funzione per avviare il timer per la domanda corrente
function startTimer() {
  clearInterval(timerInterval); // Resetta il timer

  tempoRimanente = 60; // Imposta il tempo iniziale a 60 secondi per ogni domanda
  aggiornaTimer(); // Aggiorna il timer all'inizio
  intervalloTimer = setInterval(function() {
      tempoRimanente--;
      aggiornaTimer(); // Aggiorna il timer ogni secondo
      setCircleDasharray();
      setRemainingPathColor(tempoRimanente);
      if (tempoRimanente === 0) {
          clearInterval(intervalloTimer); // Interrompi il timer quando il tempo è scaduto
          selezionaRisposta(); // Carica la prossima domanda quando il timer finisce
          startTimer(); // Avvia il timer per la nuova domanda
      }
  }, 1000); // Ogni secondo
}


// Funzione per aggiornare il timer nell'HTML
function aggiornaTimer() {
  document.getElementById("base-timer-label").innerText = tempoRimanente;
}


// Avvia il caricamento delle domande quando la pagina si carica
// window.onload = function() {
//   caricamentoDomande();
// };

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


