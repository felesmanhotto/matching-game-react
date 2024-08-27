import catImage from "./assets/cat.jpg"

function Card() {
    return(
        <div>
            <img className="card-image" src={catImage}></img>
        </div>
    );
}

export default Card;