import React, { useContext, useState, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import "../styles/Authentication.css";
import { ProductContext } from "../context/ProductProvider.jsx";
import Footer from "../components/Footer.jsx";

const Login = () => {

    const loginEmail = useRef();
    const loginEmailValidation = useRef();
    const loginPassword = useRef();
    const loginPasswordValidation = useRef();
    const loginGeneralValidation = useRef();
    const signupSpan = useRef();
    const signupMain = useRef();
    const loginMain = useRef();

    // const { accessToken, setAccessToken, storedUserId, setStoredUserId, isLoggedIn, setIsLoggedIn } = useContext(LoginContext)

    const navigate = useNavigate();

    // CLEARING INPUT FIELDS ERROR MESSAGES

    const clearErrorDisplay = () => {

        loginEmailValidation.current.innerText = ""
        loginEmail.current.style.borderColor = "black";

        loginPasswordValidation.current.innerText = ""
        loginPassword.current.style.borderColor = "black";

        loginGeneralValidation.current.innerText = "";
    }

    // DISPLAYING THE PASSWORD ON THE LOGIN PAGE

    const loginPasswordDisplay = () => {

        let attribute = (loginPassword.current.type === "password") ? "text" : "password";
        loginPassword.current.setAttribute("type", attribute);

        if (attribute === "text") {
            document.querySelector(".loginPassword").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<path fill="currentColor" d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0" />
</svg>`;
        }

        else if (attribute === "password") {
            document.querySelector(".loginPassword").innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<g fill="none">
		<path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
		<path fill="currentColor" d="M3.05 9.31a1 1 0 1 1 1.914-.577c2.086 6.986 11.982 6.987 14.07.004a1 1 0 1 1 1.918.57a9.5 9.5 0 0 1-1.813 3.417L20.414 14A1 1 0 0 1 19 15.414l-1.311-1.311a9.1 9.1 0 0 1-2.32 1.269l.357 1.335a1 1 0 1 1-1.931.518l-.364-1.357c-.947.14-1.915.14-2.862 0l-.364 1.357a1 1 0 1 1-1.931-.518l.357-1.335a9.1 9.1 0 0 1-2.32-1.27l-1.31 1.312A1 1 0 0 1 3.585 14l1.275-1.275c-.784-.936-1.41-2.074-1.812-3.414Z" />
	</g>
</svg>`;
        }

    };

    // HANDLING A USER LOGGING IN

    const handleLogin = async (event) => {
        event.preventDefault();
        const logIn = fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                loginEmail: loginEmail.current.value.trim(),
                loginPassword: loginPassword.current.value
            })
        })
        const response = await logIn;

        const { userInput, message, accessTokenUserId, generatedToken } = await response.json();

        // console.log("The first IsLoggedIn current Value: " + isLoggedIn)


        if (userInput == 1) {
            loginEmailValidation.current.innerText = message;
            loginEmail.current.style.border = "2.5px solid red";
            return;
        }

        else if (userInput == 2) {
            loginPasswordValidation.current.innerText = message;
            loginPassword.current.style.border = "2.5px solid red";
            return;
        }

        else if (userInput == 3) {
            loginGeneralValidation.current.innerText = message;
            loginEmail.current.style.border = "2.5px solid red";
            loginPassword.current.style.border = "2.5px solid red";
            return;
        }

        else {
            // setAccessToken(() => { return generatedToken });
            // setStoredUserId(() => { return accessTokenUserId });
            // setIsLoggedIn(() => { return true });

            sessionStorage.setItem("KicksNationz", JSON.stringify({
                "accessToken": generatedToken,
                "accessTokenUserId": accessTokenUserId,
                "isLoggedIn": true
            }))

            navigate("/")
            // console.log("IsLoggedIn current Value: " + isLoggedIn)
            // console.log("Current access token: ", generatedToken);
            // console.log("Current userId: ", accessTokenUserId);
            // console.log(message);

            let user = JSON.parse(sessionStorage.getItem("KicksNationz"));
            console.log("sessionStorage token " + user)

        }

        loginEmail.current.value = "";
        loginPassword.current.value = "";

    }

    // DISPLAYING THE SIGNUP PAGE

    const displaySignup = () => {
        navigate("/Signup")
    }

    return (
        <>

            <main className="login-main" ref={loginMain}>
                <section className="login-left">
                    <div> <h1>Kicks</h1><h1>Nationz </h1></div>

                    <p>Step into style. Step into confidence.</p>
                    <p> Premium snickers. Authentic vibes.</p>
                    <p> Just for you.</p>

                    <Footer />

                </section>
                <section className="login-right">
                    <form action="" className="loginForm">

                        <p ref={loginGeneralValidation}></p>
                        <br />
                        <label htmlFor="email">Email Adress</label>
                        <input type="email" id="loginEmail" placeholder="Enter your email" ref={loginEmail} onClick={clearErrorDisplay} />
                        <p ref={loginEmailValidation}></p>
                        <br />
                        <label htmlFor="password">Password</label>
                        <section className="passwordInput">
                            <input type="password" id="loginPassword" ref={loginPassword} onClick={clearErrorDisplay} placeholder="Enter your password" />
                            <button type="button" onClick={loginPasswordDisplay} className="loginPassword"> <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <g fill="none">
                                    <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                                    <path fill="currentColor" d="M3.05 9.31a1 1 0 1 1 1.914-.577c2.086 6.986 11.982 6.987 14.07.004a1 1 0 1 1 1.918.57a9.5 9.5 0 0 1-1.813 3.417L20.414 14A1 1 0 0 1 19 15.414l-1.311-1.311a9.1 9.1 0 0 1-2.32 1.269l.357 1.335a1 1 0 1 1-1.931.518l-.364-1.357c-.947.14-1.915.14-2.862 0l-.364 1.357a1 1 0 1 1-1.931-.518l.357-1.335a9.1 9.1 0 0 1-2.32-1.27l-1.31 1.312A1 1 0 0 1 3.585 14l1.275-1.275c-.784-.936-1.41-2.074-1.812-3.414Z" />
                                </g>
                            </svg>
                            </button>
                        </section>
                        <p ref={loginPasswordValidation} ></p>
                        <br />
                        <button type="button" target="" className="login-btn" onClick={handleLogin}>Log In</button>
                    </form>
                    <p>Dont have an account? <span onClick={displaySignup} ref={signupSpan}>Sign up</span> </p>

                </section>
            </main>
        </>
    );
}

export default Login;