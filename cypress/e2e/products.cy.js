/// <reference types="cypress" />
 
const BASE = "http://localhost:5173";
// Backend base URL (same value as VITE_BACKEND_URL). Set it in cypress.config.js
// under `env: { backendUrl: "..." }` or pass --env backendUrl=...
const BACKEND = "http://54.246.194.54:3000"; // change to your backend's URL (same as VITE_BACKEND_URL)
 
const VALID_USER = { email: "testcase1@gmail.com", password: "qwerty78" };
 
// Products from your database that the tests look for.
// Card heading = `${productName} ${shoeType}`, price = `R${price}`
const KNOWN_PRODUCTS = [
  { name: "Adidas Low Forum", price: "R1600" },
  { name: "Vans Hylane", price: "R2000" },
  { name: "Puma Suede", price: "R2200" },
  { name: "Nike Air Force 1", price: "R1500" },
];
 
// Log in through the API and put the session where your app expects it,
// so every test starts authenticated without repeating the login UI.
const visitAsLoggedInUser = (path = "/") => {
  cy.request("POST", `${BACKEND}/login`, {
    loginEmail: VALID_USER.email,
    loginPassword: VALID_USER.password,
  }).then(({ body }) => {
    cy.visit(`${BASE}${path}`, {
      onBeforeLoad(win) {
        win.sessionStorage.setItem(
          "KicksNationz",
          JSON.stringify({
            accessToken: body.generatedToken,
            accessTokenUserId: body.accessTokenUserId,
            isLoggedIn: true,
          })
        );
      },
    });
  });
};
 
const card = (fullName) => cy.contains(".productsSection", fullName);
 
// ======================= PRODUCTS PAGE =======================
describe("Products page", () => {
  beforeEach(() => {
    visitAsLoggedInUser("/");
  });
 
  afterEach(() => {
    const name = Cypress.currentTest.title.replace(/\W+/g, "_").slice(0, 50);
    cy.screenshot(`Products_${name}`, { capture: "runner" });
  });
   
  it("loads and displays the products from the database", () => {
    cy.get(".productsSection").should("have.length.greaterThan", 0);
  });
 
  it("opens the product details page when 'View product' is clicked", () => {
    card("Nike Air Force 1").find("button.productsBtn").click();
 
    cy.location("pathname").should("match", /\/productdetails$/i);
    cy.contains(/nike/i).should("be.visible"); // details page shows the chosen shoe
  });
  
});