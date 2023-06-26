import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import headerLogo from '../images/header_logo.svg';

function Header({ loggedIn, email, onSignOut }) {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <nav className={`header__nav-links ${isMenuOpen ? "header__nav-links_open" : ""}`}>
                { loggedIn ?
                <>
                    <p className="header__email">{email}</p>
                    <button onClick={onSignOut} className="header__link">Выйти</button>
                </> :
                <>
                    { location.pathname === "/sign-in" ?
                        <Link to="/sign-up" className="header__link">Регистрация</Link> :
                        <Link to="sign-in" className="header__link">Войти</Link>
                    }
                </>
                }
            </nav>
            <div className="header__group">
                <img className="header__logo" src={headerLogo} alt="логотип место"/>
                <div className={`header__burger-menu ${isMenuOpen ? "header__burger-menu_open" : ""}`} onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div> 
        </header>
    );
}

export default Header;