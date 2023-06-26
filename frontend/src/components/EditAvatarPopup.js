import { useEffect } from 'react';
import PopupWithForm from './PopupWithForm.js';
import useFormValidator from '../utils/useFormValidator.js';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, isLoading }) {
    const { formValues, formErrors, isValid, handleInputChange, resetForm } = useFormValidator({avatar: ''}); 

    function handleSubmit(evt) {
        evt.preventDefault();

        onUpdateAvatar({
            avatar: formValues.avatarlink
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
            isFormValid={isValid}
            name="avatar"
            title="Обновить аватар"
            buttonText="Сохранить"
            buttonLoadingText="Сохранение..."
        >
            <input
                id="avatarlink"
                type="url"
                name="avatarlink"
                onChange={handleInputChange}
                value={formValues.avatarlink || ''}
                placeholder="Ссылка на аватар"
                className="popup__input popup__input_type_avatarlink"
                required
            />
            {!isValid && formValues.avatarlink && <div className="popup__form-error-avatar">{formErrors.avatarlink}</div>}
        </PopupWithForm>
    );
}

export default EditAvatarPopup;