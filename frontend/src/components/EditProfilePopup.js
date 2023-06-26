import { useEffect, useContext } from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext.js';
import PopupWithForm from './PopupWithForm.js';
import useFormValidator from '../utils/useFormValidator.js';

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) {
    const currentUser = useContext(CurrentUserContext);
    const { formValues, formErrors, isValid, handleInputChange, resetForm, setFormValues } = useFormValidator({username: '', about: ''}); 

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        } else {
            setFormValues({
                username: currentUser.name,
                about: currentUser.about
            });
        }
    }, [currentUser, isOpen, resetForm, setFormValues]);

    function handleSubmit(evt) {
        evt.preventDefault();
      
        onUpdateUser({
          name: formValues.username,
          about: formValues.about
        });
    };

    return (
        <PopupWithForm
            isOpen={isOpen}
            onClose={onClose}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            isFormValid={isValid}
            name="edit"
            title="Редактировать профиль"
            buttonText="Сохранить"
            buttonLoadingText="Сохранение..."
        >
            <input
                onChange={handleInputChange}
                value={formValues.username || ''}
                id="username"
                type="text"
                name="username"
                placeholder="Имя"
                className="popup__input popup__input_type_username"
                minLength="2"
                maxLength="40"
                required
            />
            {!isValid && formValues.username && <div className="popup__form-error-username">{formErrors.username}</div>}
            <input
                onChange={handleInputChange}
                value={formValues.about || ''}
                id="about"
                type="text"
                name="about"
                placeholder="Вид деятельности"
                className="popup__input popup__input_type_about"
                minLength="2"
                maxLength="200"
                required
            />
            {!isValid && formValues.about && <div className="popup__form-error-about">{formErrors.about}</div>}
        </PopupWithForm>
    );
}

export default EditProfilePopup;