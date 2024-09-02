import React from "react"
import Card from "./Card.js"
import Confetti from "react-confetti"


function App() {
 
  const [cardsArray, setCardsArray] = React.useState([])
  const [locked, setLocked] = React.useState(false)
  const [showMenu, setShowMenu] = React.useState(true)
  const [animal, setAnimal] = React.useState("")
  const [size, setSize] = React.useState()
  const [winCondition, setWinCondition] = React.useState(false)


  async function generateCards(){


    if (!animal || !size) {
      console.log("No animal/size selected")
      return}

    console.log("generating cards")
    
    // Wait for fetched data before generating the cardsArray
    const response = await fetch(`https://api.the${animal}api.com/v1/images/search?limit=10`);
    const fetchedData = await response.json();

    const arraySize = 10 - size
    const imagesArray = fetchedData.slice(0, arraySize).map(img => ({id: img.id, url: img.url}));

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
      setWinCondition(true)
      setLocked(true)
      setTimeout(() => {
        setCardsArray([])
        resetOptions()
        toggleMenu()
        setLocked(false)
        setWinCondition(false)
    }, 5000)
    }
}, [cardsArray])


  function toggleMenu(){
    setShowMenu(prevShowMenu => !prevShowMenu)
  }


  function pickAnimal(animal){
    setAnimal(animal)
  }


  function pickSize(size){
    
    setSize(size)
  }

  
  function resetOptions() {
    setAnimal()
    setSize()
  }


  function showAlert() {
    window.alert("Pick an animal and a size to start the game!")
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

      <div className="div-title">
        <h1>Matching game</h1> 
        <small>Made with React</small>
      </div>

      {showMenu && (
        <div className="div-menu">
          <div className="animals-menu">
            <h3>Animals</h3>
            <div animals-buttons-container>
              <button onClick={() => {pickAnimal("dog")}} className={animal === "dog" ? "selected" : ""}>Dogs</button>
              <button onClick={() => {pickAnimal("cat")}} className={animal === "cat" ? "selected" : ""}>Cats</button>
            </div>
          </div>
          <div className="sizes-menu">
            <h3>Sizes</h3>
            <div size-buttons-container>
              <button onClick={() => {pickSize(6)}} className={size === 6 ? "selected" : ""}>8</button>
              <button onClick={() => {pickSize(4)}} className={size === 4 ? "selected" : ""} >12</button>
            </div>
          </div>
          <button className="start-game" onClick={animal && size ? generateCards : showAlert}>Start game</button>
        </div>
    )}

      {!showMenu && (
        <div className="div-game">
            <div className={size === 6 ? "cards-container-size6" : "cards-container-size4"}>
              {cardComponents}
            </div>
        </div>
      )}
      
      {winCondition && (
        <div>
          <h2 className="win-text">You win!</h2>
        </div>
      )}

      {winCondition && <Confetti />}

    </main>
  );
}

export default App;
