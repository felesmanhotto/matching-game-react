import React from "react"
import Card from "./Card.js"


function App() {
 
  const [cardsArray, setCardsArray] = React.useState([])
  const [locked, setLocked] = React.useState(false)
  const [showMenu, setShowMenu] = React.useState(true)


  async function generateCards(){

    console.log("generating cards")

    const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=10');
    const fetchedData = await response.json();

    const imagesArray = fetchedData.slice(0, 4).map(img => ({id: img.id, url: img.url}));

    const cardObjects = imagesArray.flatMap(image => [
      {id: image.id+"1", url: image.url, faceUp: false, matched: false},
      {id: image.id+"2", url: image.url, faceUp: false, matched: false}
    ]);

    const shuffledCards = cardObjects.sort(() => Math.random() - 0.5);
    setCardsArray(shuffledCards);

     // Preload images
    cardObjects.forEach(card => {
      const img = new Image();
      img.src = card.url;
    });


    toggleMenu()
  };


  function turnCard(id) {
    if (locked) return;

    setCardsArray(prevCards => prevCards.map(card =>
      card.id === id ?
      {...card, faceUp: true} :
      card
    ))
  };

  //Checking face up cards
  React.useEffect(() => {
    const faceUpCards = cardsArray.filter(card => card.faceUp && !card.matched)

    if (faceUpCards.length > 1){
      setLocked(true)

      let id1 = faceUpCards[0].id
      let id2 = faceUpCards[1].id

      if ((id1.slice(0, -1)) !== id2.slice(0, -1)){
        setTimeout(()=> {
          setCardsArray(prevArray => prevArray.map(card => 
            card.id === id1 || card.id === id2 ?
            {...card, faceUp: false}:
            card
          ))

          setLocked(false)
        }, 1000);
      } else {
        setCardsArray(prevArray => prevArray.map(card =>
          card.id === id1 || card.id === id2 ?
          {...card, matched: true} :
          card
        ))

        setLocked(false)
      }
    }
},[cardsArray]);

  // Check if game is finished
  React.useEffect(() => {
    const allMatched = cardsArray.every(card => card.matched) 

    if (allMatched && cardsArray.length > 0) {
      console.log("All cards matched")
      setLocked(true)
      setTimeout(() => {
        setCardsArray([])
        toggleMenu()
        setLocked(false)
    }, 5000)
    }
}, [cardsArray])

  function toggleMenu(){
    setShowMenu(prevShowMenu => !prevShowMenu)
  }

  const cardComponents = cardsArray.map(card =>
  <Card
    key={card.id} 
    id={card.id}
    img={card.url}
    faceUp={card.faceUp}
    turnCard={turnCard}
  />)


  return (
    <main>

      {showMenu && (
        <div>
          <h1>Menu</h1>
          <button onClick={() => {generateCards()}}>Start game</button>
        </div>
    )}

      {!showMenu && (
        <div>
            <div className="cards-container">
              {cardComponents}
            </div>
            <button onClick={locked ? undefined : toggleMenu}>Show menu</button>
        </div>
      )}
      
    </main>
  );
}

export default App;
