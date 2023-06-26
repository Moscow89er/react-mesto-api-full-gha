import { useEffect } from 'react';
import PopupWithForm from './PopupWithForm.js';
import useFormValidator from '../utils/useFormValidator.js';

function AddPlacePopup({ isOpen, onClose, onAddPlace, isLoading }) {
    const { formValues, formErrors, isValid, handleInputChange, resetForm } = useFormValidator({name: '', link: ''}); 

    function handleSubmit(evt) {
        evt.preventDefault();

        onAddPlace({
            name: formValues.cardname,
            link: formValues.cardlink
        });
    };

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }

    }, [isOpen, resetForm]);

    return (
        <PopupWithForm
            isOpen={isOpen}
            onClose={onClose}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            buttonLoadingText="Сохранение..."
            name="add"
            title="Новое место"
            buttonText="Создать"
            isFormValid={isValid}
        >
            <input
                id="cardname"
                type="text"
                name="cardname"
                onChange={handleInputChange}
                value={formValues.cardname || ''}
                placeholder="Название"
                className="popup__input popup__input_type_cardname"
                minLength={2}
                maxLength={30}
                required
            />
            {!isValid && formValues.cardname && <div className="popup__form-error-cardname">{formErrors.cardname}</div>}
            <input
                id="cardlink"
                type="url"
                name="cardlink"
                onChange={handleInputChange}
                value={formValues.cardlink || ''}
                placeholder="Ссылка на картинку"
                className="popup__input popup__input_type_cardlink"
                required
            />
            {!isValid && formValues.cardlink && <div className="popup__form-error-cardlink">{formErrors.cardlink}</div>}
        </PopupWithForm>
    );
}

export default AddPlacePopup;