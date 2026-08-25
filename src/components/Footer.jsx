import React from 'react';
import "../styles/Footer.css";

const Footer = () => {
    return (
        <>
            <footer className="footer">
                <section className="info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path fill="currentColor" d="M12 22q-3.475-.875-5.738-3.988T4 11.1V5l8-3l8 3v6.1q0 3.8-2.262 6.913T12 22m0-2.1q2.6-.825 4.3-3.3t1.7-5.5V6.375l-6-2.25l-6 2.25V11.1q0 3.025 1.7 5.5t4.3 3.3m0-7.9" />
                    </svg>

                    <h5>100% Authentic</h5>
                    <p>Genuine products</p><p>only</p>
                </section>
                <section className="info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path fill="currentColor" d="M18.795 6.5H16.5V4H2.005L1.88 19h2.225c.33 1.15 1.385 2 2.645 2s2.315-.85 2.645-2h4.715c.33 1.15 1.385 2 2.645 2s2.315-.85 2.645-2h1.355c.69 0 1.25-.56 1.25-1.25v-5.7L18.8 6.5zM17.93 8l2.02 3.5H16.5V8zM4.105 17.5h-.71l.1-12H15v10.63c-.425.35-.74.825-.895 1.37H9.39c-.33-1.15-1.385-2-2.645-2s-2.315.85-2.645 2zm2.645 2a1.25 1.25 0 1 1 0-2.5a1.25 1.25 0 0 1 0 2.5m10 0a1.25 1.25 0 1 1 0-2.5a1.25 1.25 0 0 1 0 2.5m2.645-2c-.33-1.15-1.385-2-2.645-2q-.129 0-.25.015V13h4v4.5z" />
                    </svg>
                    <h5>Fast delivery</h5>
                    <p>Quick and reliable</p><p>shipping</p>
                </section>
                <section className="info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path fill="currentColor" d="M18 12.03V10h2v2.18c-.5-.11-1-.18-1.5-.18c-.17 0-.33 0-.5.03M9.5 11c-.28 0-.5.22-.5.5V13h6v-1.5c0-.28-.22-.5-.5-.5zM6 19v-9H4v11h8.5c-.26-.62-.41-1.3-.47-2zM21 9H3V3h18zm-2-4H5v2h14zm3 13.5v-4l-1.17 1.17A4 4 0 0 0 18 14.5c-2.21 0-4 1.79-4 4s1.79 4 4 4c1.68 0 3.12-1.03 3.71-2.5H20a2.5 2.5 0 1 1-.23-3.27L18 18.5z" />
                    </svg>

                    <h5>Easy returns</h5>
                    <p>Hussle free returns</p><p>within 14 days</p>
                </section>
                <section className="info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path fill="currentColor" d="M12 2C6.49 2 2 6.49 2 12v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-5c0-.55-.45-1-1-1H4.07C4.56 7.06 7.93 4 12 4s7.44 3.06 7.93 7H18c-.55 0-1 .45-1 1v5c0 .55.45 1 1 1h2v1c0 .55-.45 1-1 1h-4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h9c1.65 0 3-1.35 3-3v-7c0-5.51-4.49-10-10-10" />
                    </svg>

                    <h5>24/7 Support</h5>
                    <p>We're here to help</p><p>you 24/7</p>
                </section>
            </footer>
        </>
    );
}

export default Footer;