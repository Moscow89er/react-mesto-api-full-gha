import React from 'react';
import useFormValidator from '../utils/useFormValidator.js';

function Login ({ onLogin }) {
    const { formValues, formErrors, isValid, handleInputChange, setFormValues } = useFormValidator({password: '', email: ''});
    
    const handleSubmit = (evt) => {
        evt.preventDefault();

        onLogin(formValues.password, formValues.email)
            .then(() => {
                setFormValues({password:'', email: ''});
            })
            .catch((err) => console.log(err));
    }

    return (
        <section className="form form-login">
            <h1 className="form__title form__title-login">Вход</h1>
            <form onSubmit={handleSubmit} noValidate className="form__type-form">
                <div className="form__inputs">
                    <div className="form__input-error">
                        <input
                            value={formValues.email}
                            onChange={handleInputChange}
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="form__input form__input-login"
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
                            className="form__input form__input-login"
                            required
                        />
                        {!isValid && formValues.password && <div className="form__error form__error-password">{formErrors.password}</div>}
                    </div>
                </div>
                <button
                    disabled={!isValid}
                    type="submit"
                    className={`${!isValid ? "form__submit-button_disabled" : "form__submit-button"}`}
                    >Войти
                </button>
            </form>
        </section>
    )
}

export default Login;