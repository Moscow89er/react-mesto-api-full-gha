import { useEffect } from 'react';
import onSucces from '../images/on_succes.png';
import onError from '../images/on_error.png';

function InfoTooltip ({ isOpen, onClose, isError, tooltipConfirm, tooltipError }) {
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
        <section className={`popup popup__tooltip ${isOpen ? "popup_opened" : ""}`}>
            <div className="popup__container popup__container-tooltip">
                <img src={isError ? onError : onSucces} className="popup__icon"></img>
                <h2 className="popup__title popup__title-tooltip">{isError ? tooltipError : tooltipConfirm}</h2>
                <button type="button" className="popup__close-button"></button>
            </div>
        </section>
    );
}

export default InfoTooltip;