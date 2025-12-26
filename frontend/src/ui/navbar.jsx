import React from 'react'

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="container navbar-inner">
                <div className="logo">JSUrlShortner</div>
                <nav className="nav-links">
                    <a href="#home">Home</a>
                    <a href="#features">Features</a>
                    <a href="#about">About</a>
                </nav>
            </div>
        </header>
    )
}