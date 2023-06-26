import { useEffect } from "react";

function PopupWithForm({ name, title, isFormValid, isOpen, isLoading, onClose, buttonText, children, handleSubmit, buttonLoadingText }) {
    useEffect(() => {
        if (!isOpen) return;

        function handleESC(evt) {
            if (evt.key === "Escape") {
                onClose();
            }
        }
        document.addEventListener("keydown", handleESC);

        return () => document.removeEventListener("keydown", handleESC)
    }, [isOpen, onClose]);

    return (
        <section className={`popup popup-${name} ${isOpen ? "popup_opened" : ""}`}>
            <div className={`popup__container popup__container-${name}`}>
                <form onSubmit={handleSubmit} name={`${name}`} className={`popup__form popup__form-${name}`} noValidate>
                    <h3 className={`popup__title popup__title-${name}`}>{`${title}`}</h3>
                    {children}
                    <button 
                        disabled={!isFormValid}
                        type="submit"
                        className={`${!isFormValid ? "popup__save-button_disabled" : "popup__save-button"}`}
                        >
                            {`${isLoading ? buttonLoadingText : buttonText}`}
                    </button>
                </form>
                <button onClick={onClose} type="button" className="popup__close-button"></button>
            </div>
        </section>
    );
}

export default PopupWithForm;