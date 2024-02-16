//----------------------------------VARIABILI GLOBALI----------------------------------
let punteggio = 6;
let domande = []; // Array per memorizzare le domande ricevute dall'API
let tempoRimanente = 60; // Tempo rimanente per rispondere a ogni domanda
let intervalloTimer; // Variabile per l'intervallo del timer

//----------------------------------FUNZIONI GLOBALI----------------------------------

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

// Funzione per avviare il quiz
function iniziaQuiz() {
    // Avvia il timer per la prima domanda
    startTimer();
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

// Funzione per mescolare un array
function mescolaArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
    clearInterval(intervalloTimer); // Interrompi il timer quando l'utente risponde a una domanda
    mostraDomanda(); // Passa alla prossima domanda
    startTimer(); // Avvia il timer per la nuova domanda
}

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

/* Funzione per avviare il timer per la domanda corrente
function avviaTimer() {
    tempoRimanente = 60; // Imposta il tempo iniziale a 60 secondi per ogni domanda
    aggiornaTimer(); // Aggiorna il timer all'inizio
    intervalloTimer = setInterval(function() {
        tempoRimanente--;
        aggiornaTimer(); // Aggiorna il timer ogni secondo
        if (tempoRimanente === 0) {
            selezionaRisposta(); // Carica la prossima domanda quando il timer finisce
          
        }
    }, 1000); // Ogni secondo
}*/

// Funzione per aggiornare il timer nell'HTML
function aggiornaTimer() {
    document.getElementById("base-timer-label").innerText = tempoRimanente;
}

// Aggiungi un gestore per il clic sui pulsanti di risposta
document.getElementById('risposte-container').addEventListener('click', function(event) {

    selezionaRisposta(event);
});

// Avvia il caricamento delle domande quando la pagina si carica
window.onload = function() {
    caricamentoDomande();
};

//----------------------------------TIMER PER PAGINA----------------------------------

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
    }
};

const TIME_LIMIT = 60; // Impostato a 60 secondi
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("timer").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

// Create and append labels
const timerContainer = document.querySelector('.base-timer');
const secondsLabel = document.createElement('div');
secondsLabel.textContent = 'Seconds';
secondsLabel.classList.add('seconds-label');

const remainingLabel = document.createElement('div');
remainingLabel.textContent = 'Remaining';
remainingLabel.classList.add('remaining-label');

timerContainer.appendChild(secondsLabel);
timerContainer.appendChild(remainingLabel);

//startTimer();

function onTimesUp() {
    clearInterval(timerInterval);
}

function startTimer() {
    timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        document.getElementById("base-timer-label").innerHTML = formatTime(
            timeLeft
        );
        setCircleDasharray();
        setRemainingPathColor(timeLeft);

        if (timeLeft === 0) {
           
            selezionaRisposta(); // Carica la prossima domanda quando il timer finisce
            
        }
    }, 1000);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${seconds}`;
}

function setRemainingPathColor(timeLeft) {
    const {
        alert,
        warning,
        info
    } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(info.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(warning.color);
    }
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
}