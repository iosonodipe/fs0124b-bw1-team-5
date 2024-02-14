fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy")
      .then((response) => response.json())
      .then((dati) => {
            let domande=dati.results
            let show = document.createElement('p')
            show.innerHTML=domande[0].question
            document.body.append(show)
            console.log(domande);
      })