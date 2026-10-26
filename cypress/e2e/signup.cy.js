
 
const SIGNUP_URL = "http://localhost:5173/Signup";
 
import { slowCypressDown } from "cypress-slow-down";

slowCypressDown(1000);
// Must already exist in your "Users" collection (used for the duplicate-email test)
const EXISTING_USER = { email: "testcase1@gmail.com", password: "qwerty78" };
 
const RED = "rgb(255, 0, 0)";
 
// Selectors based on your Signup.jsx (refs are not DOM attributes, so the
// validation <p> tags are located by their position next to each input).
const get = {
  name: () => cy.get("#fullName"),
  email: () => cy.get("#email"),
  password: () => cy.get("#password"),
  confirm: () => cy.get("#confirmPassword"),
  submit: () => cy.get("button.signup-btn"),
  togglePassword: () => cy.get("button.password"),
  toggleConfirm: () => cy.get("button.confirmPassword"),
  nameMsg: () => cy.get("#fullName").next("p"),
  emailMsg: () => cy.get("#email").next("p"),
  formMsg: () => cy.get(".passwordInput").last().next("p"), // password errors
  loginLink: () => cy.contains("span", "Log in"),
};
 
const fillForm = ({ name, email, password, confirm }) => {
  if (name) get.name().type(name);
  if (email) get.email().type(email);
  if (password) get.password().type(password);
  if (confirm) get.confirm().type(confirm);
};
 
const uniqueEmail = () => `cypress_${Date.now()}@gmail.com`;
 
describe("Signup page", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/signup").as("signup");
    cy.visit(SIGNUP_URL);
  });
 
  // Passing tests get a screenshot too (failures are captured automatically)
  afterEach(() => {
    const name = Cypress.currentTest.title.replace(/\W+/g, "_").slice(0, 50);
    cy.screenshot(`Signup_${name}`, { capture: "runner" });
  });
 
  // ---------- UI ----------
 
  it("renders the signup form with all its elements", () => {
    cy.contains("h3", "Create your account").should("be.visible");
    get.name().should("be.visible");
    get.email().should("be.visible");
    get.password().should("be.visible").and("have.attr", "type", "password");
    get.confirm().should("be.visible").and("have.attr", "type", "password");
    get.submit().should("be.visible").and("contain.text", "Sign up");
  });
 
  it("toggles visibility of the password and confirm password fields", () => {
    get.togglePassword().click();
    get.password().should("have.attr", "type", "text");
    get.togglePassword().click();
    get.password().should("have.attr", "type", "password");
 
    get.toggleConfirm().click();
    get.confirm().should("have.attr", "type", "text");
    get.toggleConfirm().click();
    get.confirm().should("have.attr", "type", "password");
  });
 
  it("navigates to the login page when 'Log in' is clicked", () => {
    get.loginLink().click();
    cy.location("pathname").should("match", /\/login$/i);
  });
 
  // ---------- Invalid input / edge cases ----------
 
  it("shows an error when the form is submitted empty", () => {
    get.submit().click();
 
    cy.wait("@signup").its("response.statusCode").should("eq", 422);
    get.nameMsg().should("have.text", "Please provide a valid userName");
    get.name().should("have.css", "border-top-color", RED);
    cy.location("pathname").should("match", /\/signup$/i);
  });
 
  it("shows an error when the name is only spaces", () => {
    fillForm({
      name: "     ",
      email: uniqueEmail(),
      password: "qwerty78",
      confirm: "qwerty78",
    });
    get.submit().click();
 
    cy.wait("@signup").its("response.statusCode").should("eq", 422);
    get.nameMsg().should("have.text", "Please provide a valid userName");
  });
 
  it("shows an error when the email is left empty", () => {
    fillForm({ name: "Cypress User", password: "qwerty78", confirm: "qwerty78" });
    get.submit().click();
 
    cy.wait("@signup").its("response.statusCode").should("eq", 422);
    get.emailMsg().should("have.text", "Emails should include '@'");
    get.email().should("have.css", "border-top-color", RED);
  });
 
  it("does not send a request when the email format is invalid", () => {
    fillForm({
      name: "Cypress User",
      email: "not-an-email",
      password: "qwerty78",
      confirm: "qwerty78",
    });
    get.submit().click();
 
    // Browser's built-in type="email" validation blocks the submit
    get.email().then(($el) => {
      expect($el[0].checkValidity()).to.be.false;
    });
    cy.get("@signup.all").should("have.length", 0);
    cy.location("pathname").should("match", /\/signup$/i);
  });
 
  it("shows an error when the password is shorter than 6 characters", () => {
    fillForm({
      name: "Cypress User",
      email: uniqueEmail(),
      password: "12345", // boundary: one below the minimum
      confirm: "12345",
    });
    get.submit().click();
 
    cy.wait("@signup").its("response.statusCode").should("eq", 422);
    get.formMsg().should("have.text", "Password should be 6 characters or more");
    get.password().should("have.css", "border-top-color", RED);
    get.confirm().should("have.css", "border-top-color", RED);
  });
 
  it("rejects a password made up only of spaces", () => {
    fillForm({
      name: "Cypress User",
      email: uniqueEmail(),
      password: "        ",
      confirm: "        ",
    });
    get.submit().click();
 
    cy.wait("@signup").its("response.statusCode").should("eq", 422);
    get.formMsg().should("have.text", "Password should be 6 characters or more");
  });
 
  it("shows an error when the passwords do not match", () => {
    fillForm({
      name: "Cypress User",
      email: uniqueEmail(),
      password: "qwerty78",
      confirm: "qwerty79",
    });
    get.submit().click();
 
    cy.wait("@signup").its("response.statusCode").should("eq", 422);
    get.formMsg().should("have.text", "Passwords do not match");
    get.password().should("have.css", "border-top-color", RED);
    get.confirm().should("have.css", "border-top-color", RED);
  });
 
  it("shows an error when the confirm password is left empty", () => {
    fillForm({
      name: "Cypress User",
      email: uniqueEmail(),
      password: "qwerty78",
    });
    get.submit().click();
 
    cy.wait("@signup").its("response.statusCode").should("eq", 422);
    get.formMsg().should("have.text", "Passwords do not match");
  });
 
  it("shows an error when the email is already registered", () => {
    fillForm({
      name: "Cypress User",
      email: EXISTING_USER.email,
      password: EXISTING_USER.password,
      confirm: EXISTING_USER.password,
    });
    get.submit().click();
 
    cy.wait("@signup").its("response.statusCode").should("eq", 409);
    get.emailMsg().should("have.text", "Email already exists");
    get.email().should("have.css", "border-top-color", RED);
    cy.location("pathname").should("match", /\/signup$/i);
  });
 
  it("clears the error messages when the user clicks into an input", () => {
    get.submit().click();
    cy.wait("@signup");
    get.nameMsg().should("not.be.empty");
 
    get.name().click();
    get.nameMsg().should("have.text", "");
    get.emailMsg().should("have.text", "");
    get.formMsg().should("have.text", "");
  });
 
  // ---------- Happy path ----------
 
  it("creates an account with valid details and redirects to the login page", () => {
    fillForm({
      name: "Cypress User",
      email: uniqueEmail(),
      password: "qwerty78",
      confirm: "qwerty78",
    });
    get.submit().click();
 
    cy.wait("@signup").then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body.message).to.eq("User created successfully");
    });
 
    cy.location("pathname").should("match", /\/login$/i);
  });
 
  it("lets a newly created user log in with the account they just made", () => {
    const email = uniqueEmail();
    const password = "qwerty78";
 
    fillForm({ name: "Cypress User", email, password, confirm: password });
    get.submit().click();
    cy.wait("@signup").its("response.statusCode").should("eq", 200);
    cy.location("pathname").should("match", /\/login$/i);
 
    // Now log in with the same credentials
    cy.intercept("POST", "**/login").as("login");
    cy.get("#loginEmail").type(email);
    cy.get("#loginPassword").type(password);
    cy.get("button[type='submit']").click();
 
    cy.wait("@login").its("response.statusCode").should("eq", 200);
    cy.location("pathname").should("eq", "/");
    cy.contains("h1", "Products").should("be.visible");
  });
});
 

