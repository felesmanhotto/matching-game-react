import React from "react"
import Card from "./Card.js"


function App() {
 
  const [data, setData] = React.useState([]);
  const [cardsArray, setCardsArray] = React.useState([])


  function fetchData() {
    fetch('https://api.thecatapi.com/v1/images/search?limit=10')
    .then(response => response.json())
    .then(data => setData(() => data))
  };

  React.useEffect(() => {
    fetchData()
  }, []);


  const generateCards = React.useCallback(() => {
    const imagesArray = data.slice(6, 10).map(img => ({id: img.id, url: img.url}));

    const cardObjects = imagesArray.flatMap(image => [
      {id: image.id, url: image.url, faceUp: false},
      {id: image.id, url: image.url, faceUp: false}
    ]);

    const shuffledCards = cardObjects.sort(() => Math.random() - 0.5);
    setCardsArray(shuffledCards);
  }, [data]);

  React.useEffect(() => {
    if (data.length > 0) {
      generateCards();
    }
  }, [data, generateCards]);


  function turnCard(id) {
    setCardsArray(prevCards => prevCards.map(card =>
      card.id === id ?
      {...card, faceUp: !card.faceUp} :
      card
    ))
  }


  const cardComponents = cardsArray.map(card =>
  <Card 
    id={card.id}
    img={card.url}
    faceUp={card.faceUp}
    turnCard={turnCard}
  />)


  return (
    <main>

        <div className="cards-container">
          {cardComponents}
        </div>
        <button onClick={fetchData}>Generate cards</button>
    </main>
  );
}

export default App;
