import { useContext } from 'react';
import CurrentUserContext from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onDeleteButtonClick }) {
    const currentUser = useContext(CurrentUserContext);
    const isOwn = card.owner._id === currentUser._id;

    const isLiked = card.likes.some(i => i._id === currentUser._id);
    const cardLikeButtonClassName = ( 
        `card__like-button ${isLiked && 'card__like-button_active'}` 
    );;

    function handleClick() {
        onCardClick(card);
    };

    function handleLikeClick() {
        onCardLike(card);
    };

    function handleDeleteClick() {
        onDeleteButtonClick(card._id);
    };

    return (
        <div className="card card_type_default">
            <div className="card__container">
                {isOwn && <button
                    onClick={handleDeleteClick}
                    type="button"
                    className="card__delete-button">
                </button> }
                <div
                    onClick={handleClick}
                    style={{ backgroundImage: `url(${card.link})`}}
                    className="card__image"
                    alt={card.name}
                />
                <div className="card__group">
                    <h2 className="card__title">{card.name}</h2>
                    <div className="card__like-group">
                        <button
                            onClick={handleLikeClick}
                            type="button"
                            className={cardLikeButtonClassName}>
                        </button>
                        <span className="card__likes-number">{card.likes.length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;