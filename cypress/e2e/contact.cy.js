
/// <reference types="cypress" />
 
const BASE = "http://localhost:5173";
// Backend base URL (same value as your VITE_BACKEND_URL).
const BACKEND = "http://54.246.194.54:3000"; // change to your backend's URL
 
const VALID_USER = { email: "testcase1@gmail.com", password: "qwerty78" };
 
// Shoes that exist in your database (the dropdown shows `${productName} ${shoeType}`)
const KNOWN_SHOES = ["Adidas Low Forum", "Nike Air Force 1", "Puma Suede", "Vans Hylane"];
 
const FEEDBACK = {
  name: "Cypress Tester",
  email: "cypress.tester@gmail.com",
  orderNumber: "KNZ45872",
  message: "The checkout was quick and the shoes arrived in perfect condition.",
};
 
const REVIEW = {
  shoe: "Nike Air Force 1",
  stars: 4,
  subject: "comfort",
  message: "Very comfortable and true to size. Would buy again.",
};
 
// ---------- Helpers ----------
const setSession = (session) => (win) =>
  win.sessionStorage.setItem(
    "KicksNationz",
    JSON.stringify({
      accessToken: session.generatedToken,
      accessTokenUserId: session.accessTokenUserId,
      isLoggedIn: true,
    })
  );
 
const visitContactUs = () => {
  cy.request("POST", `${BACKEND}/login`, {
    loginEmail: VALID_USER.email,
    loginPassword: VALID_USER.password,
  })
    .its("body")
    .then((session) => {
      cy.visit(`${BASE}/ContactUs`, { onBeforeLoad: setSession(session) });
    });
  cy.wait("@getProducts");
};
 
// The inputs have no id/name, so they are found by placeholder
const feedback = {
  name: () => cy.get("input[placeholder='Enter your name']"),
  email: () => cy.get("input[placeholder='Enter your email']"),
  orderNumber: () => cy.get("input[placeholder='Enter your order number']"),
  message: () => cy.get("textarea[placeholder='Tell us how we can help or what you think...']"),
  submit: () => cy.contains("button.Contacts_submitButton", "Send Feedback"),
};
 
const review = {
  shoeSelect: () => cy.contains(".Contacts_field", "Select the shoe you want to review").find("select"),
  stars: () => cy.get(".Contacts_rating button"),
  subjectSelect: () => cy.contains(".Contacts_field", "Your Review Subject").find("select"),
  message: () => cy.get("textarea[placeholder='Write your review about this shoe...']"),
  submit: () => cy.contains("button.Contacts_submitButton", "Submit Review"),
};
 
const fillFeedback = ({ name, email, orderNumber, message }) => {
  feedback.name().type(name);
  feedback.email().type(email);
  if (orderNumber) feedback.orderNumber().type(orderNumber);
  feedback.message().type(message);
};
 
const fillReview = ({ shoe, stars, subject, message }) => {
  review.shoeSelect().select(shoe);
  review.stars().eq(stars - 1).click();
  review.subjectSelect().select(subject);
  review.message().type(message);
};
 
const stubAlert = () => {
  const alertStub = cy.stub().as("alertStub");
  cy.on("window:alert", alertStub);
  return alertStub;
};
 
// ======================= CONTACT US PAGE =======================
describe("Contact Us page", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/products").as("getProducts");
    cy.intercept("POST", "**/postforms").as("postForm");
  });
 
  afterEach(() => {
    const name = Cypress.currentTest.title.replace(/\W+/g, "_").slice(0, 50);
    cy.screenshot(`ContactUs_${name}`, { capture: "runner" });
  });
 
  // ---------- Display ----------
 
  it("renders the heading and both forms", () => {
    visitContactUs();
 
    cy.contains("h1.Contacts_title", "Contact Us").should("be.visible");
    cy.contains("p.Contacts_subtitle", "We'd love to hear from you").should("be.visible");
    cy.contains("h2.Contacts_cardTitle", "Share Your Feedback").should("be.visible");
    cy.contains("h2.Contacts_cardTitle", "Review a Shoe").should("be.visible");
    feedback.submit().should("be.visible");
    review.submit().should("be.visible");
  });
 
  it("loads the shoe dropdown from the database, in alphabetical order", () => {
    visitContactUs();
 
    review.shoeSelect().find("option").should("have.length.greaterThan", 0);
    review.shoeSelect().find("option").then(($options) => {
      const names = [...$options].map((o) => o.textContent.trim());
      KNOWN_SHOES.forEach((shoe) => expect(names).to.include(shoe));
      expect(names).to.deep.eq([...names].sort());
    });
  });
 
  it("requests the products with an authenticated call", () => {
    cy.request("POST", `${BACKEND}/login`, {
      loginEmail: VALID_USER.email,
      loginPassword: VALID_USER.password,
    })
      .its("body")
      .then((session) => {
        cy.visit(`${BASE}/ContactUs`, { onBeforeLoad: setSession(session) });
      });
 
    cy.wait("@getProducts").then(({ request, response }) => {
      expect(request.headers.authorization).to.match(/^Basic .+/);
      expect(response.statusCode).to.eq(200);
    });
  });
 
  it("offers the five review subjects", () => {
    visitContactUs();
 
    review.subjectSelect().find("option:not([disabled])").should("have.length", 5);
    ["Product Quality", "Comfort", "Design", "Value for Money", "Delivery Experience"].forEach(
      (label) => {
        review.subjectSelect().contains("option", label).should("exist");
      }
    );
  });
 
  // ---------- Feedback form: interaction ----------
 
  it("selects 'General feedback' by default and switches to 'Review a product'", () => {
    visitContactUs();
 
    cy.contains("label.Contacts_radioCard", "General feedback")
      .should("have.class", "Contacts_radioSelected")
      .find("input[type='radio']")
      .should("be.checked");
 
    cy.contains("label.Contacts_radioCard", "Review a product").click();
 
    cy.contains("label.Contacts_radioCard", "Review a product")
      .should("have.class", "Contacts_radioSelected")
      .find("input[type='radio']")
      .should("be.checked");
    cy.contains("label.Contacts_radioCard", "General feedback")
      .should("not.have.class", "Contacts_radioSelected");
  });
 
  it("accepts text in every feedback field", () => {
    visitContactUs();
    fillFeedback(FEEDBACK);
 
    feedback.name().should("have.value", FEEDBACK.name);
    feedback.email().should("have.value", FEEDBACK.email);
    feedback.orderNumber().should("have.value", FEEDBACK.orderNumber);
    feedback.message().should("have.value", FEEDBACK.message);
  });
 
  it("limits the feedback message to 1000 characters", () => {
    visitContactUs();
 
    feedback.message().type("a".repeat(1005), { delay: 0 });
    feedback.message().invoke("val").should("have.length", 1000);
  });
 
  // ---------- Feedback form: submit ----------
 
  it("sends feedback to the server and clears the contact fields", () => {
    visitContactUs();
    stubAlert();
 
    fillFeedback(FEEDBACK);
    feedback.submit().click();
 
    cy.wait("@postForm").then(({ request, response }) => {
      expect(request.headers.authorization).to.match(/^Basic .+/);
      expect(request.body).to.deep.eq({
        name: FEEDBACK.name,
        email: FEEDBACK.email,
        orderNumber: FEEDBACK.orderNumber,
        message: FEEDBACK.message,
      });
      expect(response.statusCode).to.eq(200);
    });
 
    feedback.name().should("have.value", "");
    feedback.email().should("have.value", "");
    feedback.orderNumber().should("have.value", "");
  });
 
  it("accepts feedback when the optional order number is left blank", () => {
    visitContactUs();
    stubAlert();
 
    fillFeedback({ ...FEEDBACK, orderNumber: "" });
    feedback.submit().click();
 
    cy.wait("@postForm").then(({ request, response }) => {
      expect(request.body.orderNumber).to.eq("");
      expect(response.statusCode).to.eq(200);
    });
  });
 
  it("shows the server's message and keeps the entered text when sending fails", () => {
    cy.intercept("POST", "**/postforms", {
      statusCode: 500,
      body: { message: "Could not save your feedback" },
    }).as("postFormFails");
    visitContactUs();
    stubAlert();
 
    fillFeedback(FEEDBACK);
    feedback.submit().click();
 
    cy.wait("@postFormFails");
    feedback.name().should("have.value", FEEDBACK.name);
    feedback.email().should("have.value", FEEDBACK.email);
    feedback.message().should("have.value", FEEDBACK.message);
  });
 
  // ---------- Review form: interaction ----------
 
  it("shows five rating stars", () => {
    visitContactUs();
 
    review.stars().should("have.length", 5).each(($star) => {
      expect($star.text().trim()).to.eq("★");
    });
  });
 
  it("accepts a review message and limits it to 1000 characters", () => {
    visitContactUs();
 
    review.message().type(REVIEW.message);
    review.message().should("have.value", REVIEW.message);
 
    review.message().clear().type("a".repeat(1005), { delay: 0 });
    review.message().invoke("val").should("have.length", 1000);
  });
 
 
  // ---------- Products could not be loaded ----------
 
  it("warns the user and leaves the shoe dropdown empty when the products fail to load", () => {
    cy.intercept("GET", "**/products", {
      statusCode: 500,
      body: { message: "Server error" },
    }).as("getProductsFails");
    stubAlert();
 
    cy.request("POST", `${BACKEND}/login`, {
      loginEmail: VALID_USER.email,
      loginPassword: VALID_USER.password,
    })
      .its("body")
      .then((session) => {
        cy.visit(`${BASE}/ContactUs`, { onBeforeLoad: setSession(session) });
      });
    cy.wait("@getProductsFails");
 
    review.shoeSelect().find("option").should("have.length", 0);
  });
 
 
  it("clears the feedback message box after a successful send", () => {
    visitContactUs();
    stubAlert();
 
    fillFeedback(FEEDBACK);
    feedback.submit().click();
    cy.wait("@postForm").its("response.statusCode").should("eq", 200);
 
    feedback.message().should("have.value", "");
  });
 
  // when the user picks something, so an untouched dropdown sends name: "".
  it("sends the shoe shown in the dropdown even when the user does not change it", () => {
    visitContactUs();
    stubAlert();
 
    review.stars().eq(2).click();
    review.subjectSelect().select("design");
    review.message().type(REVIEW.message);
    review.submit().click();
 
    cy.wait("@postForm")
      .its("request.body.name")
      .should("eq", KNOWN_SHOES[0]);
  });
 
 
 
  // GAP: the counter under each text box always reads "0 / 1000".
  it("updates the character counter as the user types", () => {
    visitContactUs();
 
    feedback.message().type("hello");
    cy.contains(".Contacts_characterCount", "5 / 1000").should("be.visible");
  });
});