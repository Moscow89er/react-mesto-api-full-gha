import React from 'react';
import { Link } from "react-router-dom";
import useFormValidator from '../utils/useFormValidator.js';

function Register ({ onRegister }) {
    const { formValues, formErrors, isValid, handleInputChange } = useFormValidator({password: '', email: ''});

    const handleSubmit = (evt) => {
        evt.preventDefault();
        const {password, email} = formValues;
        onRegister(password, email);
    }

    return (
        <section className="form form-register">
            <h1 className="form__title form__title-register">Регистрация</h1>
            <form onSubmit={handleSubmit} noValidate className="form__type-form">
                <div className="form__inputs">
                    <div className="form__input-error">
                        <input
                            value={formValues.email}
                            onChange={handleInputChange}
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="form__input form__input-register"
                            required
                        />
                    </div>
                    <div className="form__input-error">
                        {!isValid && formValues.email && <div className="form__error form__error-email">{formErrors.email}</div>}
                        <input
                            value={formValues.password}
                            onChange={handleInputChange}
                            type="password"
                            name="password"
                            placeholder="Пароль"
                            className="form__input form__input-register"
                            minLength="4"
                            maxLength="20"
                            required
                        />
                        {!isValid && formValues.password && <div className="form__error form__error-password">{formErrors.password}</div>}
                    </div>
                </div>
                <button
                    disabled={!isValid}
                    type="submit"
                    className={`${!isValid ? "form__submit-button_disabled" : "form__submit-button"}`}
                    >Зарегистрироваться
                </button>
            </form>
            <Link to="/sign-in" className="form__link form__link-register">Уже зарегистрированы? Войти</Link>
        </section>
    )
}

export default Register;