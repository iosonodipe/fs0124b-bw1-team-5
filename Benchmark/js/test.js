// fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy")
//   .then((response) => response.json())
//   .then((dati) => {
//     let domande = dati.results;

//   });

//----------------------------------VARIABILI GLOBALI----------------------------------
let punteggio = 6;
let domande = []; // Array per memorizzare le domande ricevute dall'API

//----------------------------------SELETTORI GLOBALI----------------------------------
//let iframe = document.querySelector("iframe");

//----------------------------------FUNZIONI GLOBALI----------------------------------

//funzione che aspetta riempimento di iframe per poi andare a ricavare il contenuto di esso e appenderlo al container dell'index
//iframe.onload = function () {
//  const oldNode = iframe.contentWindow.document.getElementById("content");
//  let dynamicContainer = document.querySelector(".dynamic-container");
//  let clone = document.importNode(oldNode, true);
//  dynamicContainer.append(clone);
//  //calcoloPercentualeCorrette();
//  //calcoloPercentualeErrate();
//};


        // Funzione per caricare le domande dall'API
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

//----------------------------------FUNZIONI DI PAGINA----------------------------------

       // Funzione per avviare il quiz
       function iniziaQuiz() {
        // Mostra la prima domanda
        mostraDomanda();
    }

    // Funzione per mostrare una domanda
    function mostraDomanda() {
        // Controlla se ci sono ancora domande rimanenti
        if (domande.length === 0) {
            // Se non ci sono più domande, mostra il risultato finale
            mostraRisultato();
            return;
        }

        // Prendi la prima domanda dall'array
        let domandaCorrente = domande.pop();

        // Aggiorna il contenuto della domanda nel documento HTML
        document.getElementById('domanda').innerText = domandaCorrente.question;

        // Rimuovi le risposte precedenti
        document.getElementById('risposte-container').innerHTML = '';

        // Crea e aggiungi i pulsanti di risposta
        if (domandaCorrente.type === "multiple") {
            // Domanda con più risposte
            for (let risposta of domandaCorrente.incorrect_answers) {
                let button = createButton(risposta);
                document.getElementById('risposte-container').appendChild(button);
            }
            // Aggiungi la risposta corretta come ultimo bottone
            let button = createButton(domandaCorrente.correct_answer);
            document.getElementById('risposte-container').appendChild(button);
        } else if (domandaCorrente.type === "boolean") {
            // Domanda True/False
            let trueButton = createButton('True');
            let falseButton = createButton('False');
            document.getElementById('risposte-container').appendChild(trueButton);
            document.getElementById('risposte-container').appendChild(falseButton);
        }
    }

    // Funzione per creare un bottone con uno stile simile ai bottoni nel markup HTML
    function createButton(text) {
        let button = document.createElement('button');
        button.className = 'bottone';
        button.type = 'button';
        button.innerText = text;
        return button;
    }

    // Funzione chiamata quando l'utente seleziona una risposta
    function selezionaRisposta(event) {
        let rispostaSelezionata = event.target.innerText;
        if (rispostaSelezionata === domande[domande.length - 1].correct_answer) {
            punteggio++; // Incrementa il punteggio se la risposta è corretta
        }
        mostraDomanda(); // Passa alla prossima domanda
    }

    // Aggiungi un gestore per il clic sui pulsanti di risposta
    document.getElementById('risposte-container').addEventListener('click', selezionaRisposta);

    // Funzione per mostrare il risultato finale
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

    // Avvia il caricamento delle domande quando la pagina si carica
    window.onload = function () {
        caricamentoDomande();
    };





//result page

