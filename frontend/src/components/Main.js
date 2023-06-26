import { useContext } from 'react';
import Card from './Card.js';
import CurrentUserContext from '../contexts/CurrentUserContext.js';

function Main({ onEditAvatar, onEditProfile, onAddPlace, onCardClick, handleCardLike, onDeleteButtonClick, cards }) {
    const currentUser = useContext(CurrentUserContext);

    return (
        <main className="main">
            <section className="profile">
                <div className="profile__container">
                    <div
                        style={{ backgroundImage: `url(${currentUser.avatar})`}}
                        className="profile__avatar"
                        alt={currentUser.name}
                    />
                    <button 
                        onClick={onEditAvatar}
                        type="button"
                        className="profile__avatar-button">
                    </button>
                </div>
                <h1 className="profile__title">{currentUser.name}</h1>
                <button
                    onClick={onEditProfile}
                    type="button"
                    className="profile__edit-button">
                </button>
                <p className="profile__subtitle">{currentUser.about}</p>
                <button 
                    onClick={onAddPlace}
                    type="button"
                    className="profile__add-button">
                </button>
            </section>
            <section className="cards">
                {cards.map((card) => (
                <Card
                    card={card}
                    key={card._id}
                    onCardClick={onCardClick}
                    onCardLike={handleCardLike}
                    onDeleteButtonClick={onDeleteButtonClick}
                />
                ))}
            </section>
        </main>
    );
}

export default Main;