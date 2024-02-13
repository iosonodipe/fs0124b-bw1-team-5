const domande = fetch(
  "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy"
)
  .then((response) => response.json())
  .then((dati) => dati.results);

console.log(domande);