import React from "react";
import "../styles/Footer2.css";

const Footer2 = () => {
  return (
    <>
      <footer className="footer2">
        <hr className="footer2-hr" />
        <main className="footer2-main">
          <section className="footer2-sloganSection">
            <div className="footer2Title">
              <section>
                <img
                  src="Kickz_Nationz_Logo.png"
                  alt="Kickz Nationz Logo"
                  width="100%"
                  height="100%"
                />
              </section>
              <h2>Kicks Nationz</h2>
            </div>
            <p>
              {" "}
              <strong>Step Into Your Size, Step Into Your Style.</strong><br />
              Your perfect fit, your unique style. Find your kicks, own your
              stride!
            </p>{" "}
            <hr />
                       <div className="footer2Icons">
                <section className="info2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path fill="currentColor" d="M12 22q-3.475-.875-5.738-3.988T4 11.1V5l8-3l8 3v6.1q0 3.8-2.262 6.913T12 22m0-2.1q2.6-.825 4.3-3.3t1.7-5.5V6.375l-6-2.25l-6 2.25V11.1q0 3.025 1.7 5.5t4.3 3.3m0-7.9" />
                    </svg>

                    <p>Authentic shoes </p>
                </section>
                <section className="info2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path fill="currentColor" d="M18.795 6.5H16.5V4H2.005L1.88 19h2.225c.33 1.15 1.385 2 2.645 2s2.315-.85 2.645-2h4.715c.33 1.15 1.385 2 2.645 2s2.315-.85 2.645-2h1.355c.69 0 1.25-.56 1.25-1.25v-5.7L18.8 6.5zM17.93 8l2.02 3.5H16.5V8zM4.105 17.5h-.71l.1-12H15v10.63c-.425.35-.74.825-.895 1.37H9.39c-.33-1.15-1.385-2-2.645-2s-2.315.85-2.645 2zm2.645 2a1.25 1.25 0 1 1 0-2.5a1.25 1.25 0 0 1 0 2.5m10 0a1.25 1.25 0 1 1 0-2.5a1.25 1.25 0 0 1 0 2.5m2.645-2c-.33-1.15-1.385-2-2.645-2q-.129 0-.25.015V13h4v4.5z" />
                    </svg>
                    <p>Fast deliveries</p>
             </section>
            </div>
          </section>
          <section className="footer2-navSection"></section>
          <section className="footer2-contactSection"></section>
          <section className="footer2-deliverySection"></section>
          <section className="footer2-socialSection"></section>
        </main>
      </footer>
    </>
  );
};

export default Footer2;
