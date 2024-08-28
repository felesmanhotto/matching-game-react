import card from "./assets/card.png"

function Card(props) {

    return(
        <div>
            <img alt="Game card" className="card-image"
             src={props.faceUp ? props.img : card}
             onClick={() => props.turnCard(props.id)}
             ></img>
        </div>
    );
}

export default Card;