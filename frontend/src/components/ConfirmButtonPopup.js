import PopupWithForm from './PopupWithForm.js';

function ConfirmButtonPopup({ cardId, isOpen, onClose, onCardDelete, isLoading }) {
    const isValid = true;

    function handleSubmit(evt) {
        evt.preventDefault();

        onCardDelete(cardId);
    };

    return (
        <PopupWithForm
            isOpen={isOpen}
            onClose={onClose}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            isFormValid={isValid}
            name="confirm"
            title="Вы уверены?"
            buttonText="Да"
            buttonLoadingText="Удаление..."
        />
    );
}

export default ConfirmButtonPopup;