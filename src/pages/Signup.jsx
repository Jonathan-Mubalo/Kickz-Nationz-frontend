import React, { useContext, useState, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import "../styles/Authentication.css";
import { ProductContext } from "../context/ProductProvider.jsx";
import Footer from "../components/Footer.jsx";
// import { LoginContext } from "../context/LoginContextProvider.jsx";


const Signup = () => {

    const userName = useRef();
    const userNameValidation = useRef();
    const userEmail = useRef();
    const userEmailValidation = useRef();
    const userPassword = useRef();
    const userConfirmPassword = useRef();
    const formValidation = useRef();
    const loginSpan = useRef();
    const signupMain = useRef();

    const { accessToken, setAccessToken, storedUserId, setStoredUserId, isLoggedIn, setIsLoggedIn } = useContext(LoginContext)

    const navigate = useNavigate();

    // ERROR HANDLING AND SIGNING UP A USER

    const handleSignup = async (event) => {
        event.preventDefault()
        const signUp = fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                signupName: userName.current.value.trim(),
                signupEmail: userEmail.current.value,
                signupPassword: userPassword.current.value,
                signupConfirmPassword: userConfirmPassword.current.value
            })
        })

        const response = await signUp;
        const { userInput, message } = await response.json();

        if (userInput === 1) {
            userName.current.style.borderColor = "red";
            userNameValidation.current.innerText = message;
            return;
        }

        if (userInput === 2) {
            userEmail.current.style.borderColor = "red";
            userEmailValidation.current.innerText = message;
            return;
        }

        if (userInput === 3) {
            userPassword.current.style.borderColor = "red";
            userConfirmPassword.current.style.borderColor = "red";
            return formValidation.current.innerText = message;
        }

        if (userInput === 4) {
            userPassword.current.style.borderColor = "red";
            userConfirmPassword.current.style.borderColor = "red";
            return formValidation.current.innerText = message;
        }

        if (userInput === 5) {
            userEmail.current.style.borderColor = "red";
            return userEmailValidation.current.innerText = message;

        }

        displayLogin();
        userName.current.value = "";
        userEmail.current.value = "";
        userPassword.current.value = "";
        userConfirmPassword.current.value = "";

    };

    // CLEARING INPUT FIELDS ERROR MESSAGES

    const formValidationDisplay = () => {

        userNameValidation.current.innerText = "";
        userName.current.style.borderColor = "black";

        userEmailValidation.current.innerText = "";
        userEmail.current.style.borderColor = "black";

        formValidation.current.innerText = "";
        userPassword.current.style.borderColor = "black";
        userConfirmPassword.current.style.borderColor = "black";

    }

    // DISPLAYING THE PASSWORD ON THE SIGNUP PAGE

    const passwordDisplay = () => {

        let attribute = (userPassword.current.type === "password") ? "text" : "password";
        userPassword.current.setAttribute("type", attribute);

        if (attribute === "text") {
            document.querySelector(".password").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<path fill="currentColor" d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0" />
</svg>`;
        }

        else if (attribute === "password") {
            document.querySelector(".password").innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<g fill="none">
		<path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
		<path fill="currentColor" d="M3.05 9.31a1 1 0 1 1 1.914-.577c2.086 6.986 11.982 6.987 14.07.004a1 1 0 1 1 1.918.57a9.5 9.5 0 0 1-1.813 3.417L20.414 14A1 1 0 0 1 19 15.414l-1.311-1.311a9.1 9.1 0 0 1-2.32 1.269l.357 1.335a1 1 0 1 1-1.931.518l-.364-1.357c-.947.14-1.915.14-2.862 0l-.364 1.357a1 1 0 1 1-1.931-.518l.357-1.335a9.1 9.1 0 0 1-2.32-1.27l-1.31 1.312A1 1 0 0 1 3.585 14l1.275-1.275c-.784-.936-1.41-2.074-1.812-3.414Z" />
	</g>
</svg>`;
        }

    };

    // DISPLAYING THE CONFIRMPASSWORD ON THE SIGNUP PAGE

    const confirmPasswordDisplay = () => {

        let attribute = (userConfirmPassword.current.type === "password") ? "text" : "password";
        userConfirmPassword.current.setAttribute("type", attribute);

        if (attribute === "text") {
            document.querySelector(".confirmPassword").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<path fill="currentColor" d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0" />
</svg>`;
        }

        else if (attribute === "password") {
            document.querySelector(".confirmPassword").innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<g fill="none">
		<path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
		<path fill="currentColor" d="M3.05 9.31a1 1 0 1 1 1.914-.577c2.086 6.986 11.982 6.987 14.07.004a1 1 0 1 1 1.918.57a9.5 9.5 0 0 1-1.813 3.417L20.414 14A1 1 0 0 1 19 15.414l-1.311-1.311a9.1 9.1 0 0 1-2.32 1.269l.357 1.335a1 1 0 1 1-1.931.518l-.364-1.357c-.947.14-1.915.14-2.862 0l-.364 1.357a1 1 0 1 1-1.931-.518l.357-1.335a9.1 9.1 0 0 1-2.32-1.27l-1.31 1.312A1 1 0 0 1 3.585 14l1.275-1.275c-.784-.936-1.41-2.074-1.812-3.414Z" />
	</g>
</svg>`;
        }

    };

    const displayLogin = () => {
        navigate("/Login")
    }

    return (
        <>
            <main className="signup-main" ref={signupMain}>
                <section className="signup-left">

                    <div> <h1>Kicks</h1><h1>Nationz </h1></div>

                    <p>Step into style. Step into confidence.</p>
                    <p> Premium snickers. Authentic vibes.</p>
                    <p> Just for you.</p>

                    <Footer />

                </section>
                <section className="signup-right">
                    <form action="">
                        <h3>Create your account</h3>
                        <p id="slogan">Join Kickz Nationz and unlock the best in sneakers.</p>
                        <label htmlFor="fullName">Full Name</label>
                        <input type="text" id="fullName" ref={userName} onClick={formValidationDisplay} placeholder="Enter your full name" />
                        <p ref={userNameValidation}></p>
                        <label htmlFor="email">Email Adress</label>
                        <input type="email" id="email" ref={userEmail} onClick={formValidationDisplay} placeholder="Enter your email" />
                        <p ref={userEmailValidation}></p>
                        <label htmlFor="password">Password</label>
                        <section className="passwordInput">
                            <input type="password" id="password" ref={userPassword} onClick={formValidationDisplay} placeholder="Create your password" />
                            <button type="button" onClick={passwordDisplay} className="password">   <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <g fill="none">
                                    <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                                    <path fill="currentColor" d="M3.05 9.31a1 1 0 1 1 1.914-.577c2.086 6.986 11.982 6.987 14.07.004a1 1 0 1 1 1.918.57a9.5 9.5 0 0 1-1.813 3.417L20.414 14A1 1 0 0 1 19 15.414l-1.311-1.311a9.1 9.1 0 0 1-2.32 1.269l.357 1.335a1 1 0 1 1-1.931.518l-.364-1.357c-.947.14-1.915.14-2.862 0l-.364 1.357a1 1 0 1 1-1.931-.518l.357-1.335a9.1 9.1 0 0 1-2.32-1.27l-1.31 1.312A1 1 0 0 1 3.585 14l1.275-1.275c-.784-.936-1.41-2.074-1.812-3.414Z" />
                                </g>
                            </svg>
                            </button>
                        </section>
                        <label htmlFor="password">Confirm Password</label>
                        <section className="passwordInput">
                            <input type="password" id="confirmPassword" ref={userConfirmPassword} onClick={formValidationDisplay} placeholder="Confirm your password" />
                            <button type="button" onClick={confirmPasswordDisplay} className="confirmPassword"> <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <g fill="none">
                                    <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                                    <path fill="currentColor" d="M3.05 9.31a1 1 0 1 1 1.914-.577c2.086 6.986 11.982 6.987 14.07.004a1 1 0 1 1 1.918.57a9.5 9.5 0 0 1-1.813 3.417L20.414 14A1 1 0 0 1 19 15.414l-1.311-1.311a9.1 9.1 0 0 1-2.32 1.269l.357 1.335a1 1 0 1 1-1.931.518l-.364-1.357c-.947.14-1.915.14-2.862 0l-.364 1.357a1 1 0 1 1-1.931-.518l.357-1.335a9.1 9.1 0 0 1-2.32-1.27l-1.31 1.312A1 1 0 0 1 3.585 14l1.275-1.275c-.784-.936-1.41-2.074-1.812-3.414Z" />
                                </g>
                            </svg>
                            </button>
                        </section>
                        <p ref={formValidation} ></p>
                        <button type="submit" target="" onClick={handleSignup} className="signup-btn" >Sign up</button>
                    </form>
                    <p className="span">Dont have an account? <span onClick={displayLogin} ref={loginSpan}>Log in</span> </p>

                </section>
            </main>
        </>
    );
}

export default Signup;