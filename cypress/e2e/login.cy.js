/// <reference types="cypress" />
import { slowCypressDown } from "cypress-slow-down";

slowCypressDown(600);

const LOGIN_URL = "http://localhost:5173/Login";

// Must be an account that already exists in your "Users" collection
const VALID_USER = { email: "testcase1@gmail.com", password: "qwerty78" };

// Selectors based on your Login.jsx (refs are NOT DOM attributes, so we
// locate the validation <p> tags by their position in the form).
const get = {
  email: () => cy.get("#loginEmail"),
  password: () => cy.get("#loginPassword"),
  submit: () => cy.get("button[type='submit']"),
  toggle: () => cy.get("button.loginPassword"),
  generalMsg: () => cy.get(".loginForm > p").first(),
  emailMsg: () => cy.get("#loginEmail").next("p"),
  passwordMsg: () => cy.get(".passwordInput").next("p"),
  signupLink: () => cy.contains("span", "Sign up"),
};

const RED = "rgb(255, 0, 0)";

describe("Login page", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/login").as("login");
    cy.visit(LOGIN_URL);
  });

  // Passing tests get a screenshot too (failures are captured automatically)
  afterEach(() => {
    const name = Cypress.currentTest.title.replace(/\W+/g, "_").slice(0, 50);
    cy.screenshot(`Login_${name}`, { capture: "runner" });
  });

  // ---------- UI ----------

  it("renders the login form with all its elements", () => {
    get.email().should("be.visible");
    get.password().should("be.visible").and("have.attr", "type", "password");
    get.submit().should("be.visible").and("contain.text", "Log In");
    get.signupLink().should("be.visible");
  });

  it("toggles password visibility when the eye button is clicked", () => {
    get.password().type("qwerty78");
    get.toggle().click();
    get.password().should("have.attr", "type", "text");
    get.toggle().click();
    get.password().should("have.attr", "type", "password");
  });

  it("navigates to the signup page when 'Sign up' is clicked", () => {
    get.signupLink().click();
    cy.location("pathname").should("match", /\/signup$/i);
  });

  // ---------- Invalid input / edge cases ----------

  it("shows an error when the email is left empty", () => {
    get.password().type(VALID_USER.password);
    get.submit().click();

    cy.wait("@login").its("response.statusCode").should("eq", 400);
    get.emailMsg().should("have.text", "Please insert your email");
    get.email().should("have.css", "border-top-color", RED);
    cy.location("pathname").should("match", /\/login$/i);
  });

  it("shows an error when the password is left empty", () => {
    get.email().type(VALID_USER.email);
    get.submit().click();

    cy.wait("@login").its("response.statusCode").should("eq", 400);
    get.passwordMsg().should("have.text", "Please insert your password");
    get.password().should("have.css", "border-top-color", RED);
    cy.location("pathname").should("match", /\/login$/i);
  });

  it("shows an error when both fields are empty", () => {
    get.submit().click();

    cy.wait("@login");
    get.emailMsg().should("have.text", "Please insert your email");
  });

  it("does not send a request when the email format is invalid", () => {
    get.email().type("not-an-email");
    get.password().type(VALID_USER.password);
    get.submit().click();

    // Browser's built-in type="email" validation blocks the submit
    get.email().then(($el) => {
      expect($el[0].checkValidity()).to.be.false;
    });
    cy.get("@login.all").should("have.length", 0);
    cy.location("pathname").should("match", /\/login$/i);
  });

  it("shows 'User is not found' for an email that is not registered", () => {
    get.email().type("nobody.here@gmail.com");
    get.password().type("qwerty78");
    get.submit().click();

    cy.wait("@login").its("response.statusCode").should("eq", 400);
    get.generalMsg().should("have.text", "User is not found, sign up?");
    get.email().should("have.css", "border-top-color", RED);
    get.password().should("have.css", "border-top-color", RED);
    cy.location("pathname").should("match", /\/login$/i);
  });


  it("clears the error messages when the user clicks into an input", () => {
    get.email().type("nobody.here@gmail.com");
    get.password().type("qwerty78");
    get.submit().click();
    cy.wait("@login");
    get.generalMsg().should("not.be.empty");

    get.email().click();
    get.generalMsg().should("have.text", "");
    get.emailMsg().should("have.text", "");
    get.passwordMsg().should("have.text", "");
  });

  // ---------- Happy path ----------

  it("logs in with valid credentials, stores the session and goes to the products page", () => {
    get.email().type(VALID_USER.email);
    get.password().type(VALID_USER.password);
    get.submit().click();

    // Authentication succeeded on the backend
    cy.wait("@login").then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body.message).to.eq("Password is correct");
      expect(response.body).to.have.property("generatedToken");
      expect(response.body).to.have.property("accessTokenUserId");
    });

    // Redirected to products page
    cy.location("pathname").should("eq", "/");
    cy.contains("h1", "Products").should("be.visible");

    // Session handling
    cy.window().then((win) => {
      const session = JSON.parse(win.sessionStorage.getItem("KicksNationz"));
      expect(session.isLoggedIn).to.be.true;
      expect(session.accessToken).to.be.a("string").and.not.be.empty;
      expect(session.accessTokenUserId).to.be.a("string").and.not.be.empty;
    });
  });
});