
/// <reference types="cypress" />
 
const BASE = "http://localhost:5173";
// Backend base URL (same value as your VITE_BACKEND_URL).
const BACKEND = "http://54.246.194.54:3000"; // change to your backend's URL
 
const VALID_USER = { email: "testcase1@gmail.com", password: "qwerty78" };
 
// ---------- Test data (matches your database) ----------
const NIKE_ITEM = {
  productId: "6a8758b0a8cafeed63f97739",
  quantity: 1,
  productName: "Nike",
  productType: "Air Force 1",
  productColor: "Black",
  productSize: "9",
  currency: "ZAR",
  price: 1500,
  imageUrls: [
    "https://emkfvwszklugneydgumh.supabase.co/storage/v1/object/public/venues/images/1787253154608-4c285098ee259cb9aae122c5b99639c0.jpg",
  ],
  stockQuantity: 12,
};
 
const ADIDAS_ITEM = {
  productId: "6a8758a8a8cafeed63f97736",
  quantity: 2,
  productName: "Adidas",
  productType: "Low Forum",
  productColor: "White",
  productSize: "10",
  currency: "ZAR",
  price: 1600,
  imageUrls: [
    "https://emkfvwszklugneydgumh.supabase.co/storage/v1/object/public/venues/images/1787254889520-3e071422d8a2d04a51fbb535ee5a0a36.jpg",
  ],
  stockQuantity: 10,
};
 
// Nike 1 x R1500 + Adidas 2 x R1600
const START_TOTAL = 1500 * 1 + 1600 * 2; // R4700
 
const total = (items) => items.reduce((sum, i) => sum + i.price * i.quantity, 0);
const clone = (items) => Cypress._.cloneDeep(items);
 
// ---------- Helpers ----------
const loginRequest = () =>
  cy
    .request("POST", `${BACKEND}/login`, {
      loginEmail: VALID_USER.email,
      loginPassword: VALID_USER.password,
    })
    .its("body");
 
const setSession = (session) => (win) =>
  win.sessionStorage.setItem(
    "KicksNationz",
    JSON.stringify({
      accessToken: session.generatedToken,
      accessTokenUserId: session.accessTokenUserId,
      isLoggedIn: true,
    })
  );
 
// Puts the user's cart in a known state through the API:
// make sure a cart exists (POST), then overwrite it exactly (PUT).
const seedCart = (session, items) => {
  const headers = {
    "Content-Type": "application/json",
    authorization: `Basic ${session.generatedToken}`,
  };
  cy.request({
    method: "POST",
    url: `${BACKEND}/selectedproduct/${session.accessTokenUserId}`,
    headers,
    body: NIKE_ITEM,
    failOnStatusCode: false,
  });
  cy.request({
    method: "PUT",
    url: `${BACKEND}/editcart/${session.accessTokenUserId}`,
    headers,
    body: { shoppingCart: items, totalPrice: total(items) },
  });
};
 
// Seed the cart, then open /Cart as a logged-in user.
// The Cart page saves itself (PUT /editcart) whenever it loads or changes,
// so we wait for that first save to avoid mixing it up with later ones.
const visitCartWith = (items) => {
  loginRequest().then((session) => {
    seedCart(session, items);
    cy.visit(`${BASE}/Cart`, { onBeforeLoad: setSession(session) });
  });
  cy.wait("@getCart");
  if (items.length > 0) cy.wait("@editCart");
};
 
const item = (fullName) => cy.contains(".cart_item", fullName);
const totalText = () => cy.get(".cart_summary_total h2");
const subtotalText = () => cy.get(".cart_summary_row span").last();
 
// ======================= CART PAGE =======================
describe("Cart page", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/mycart/*").as("getCart");
    cy.intercept("PUT", "**/editcart/*").as("editCart");
  });
 
  afterEach(() => {
    const name = Cypress.currentTest.title.replace(/\W+/g, "_").slice(0, 50);
    cy.screenshot(`Cart_${name}`, { capture: "runner" });
  });
 

  it("displays every item in the cart with its details", () => {
    visitCartWith(clone([NIKE_ITEM, ADIDAS_ITEM]));
 
    cy.get(".cart_item").should("have.length", 2);
 
    item("Nike Air Force 1").within(() => {
      cy.get("h3").should("have.text", "Nike Air Force 1");
      cy.contains("p", "Color: Black").should("be.visible");
      cy.contains("p", "Size: 9").should("be.visible");
      cy.get(".cart_details h4").should("have.text", "R1500");
      cy.get(".productDetails_counterValue").should("have.text", "1");
      cy.get("h4.cart_price").should("have.text", "R1500");
    });
 
    item("Adidas Low Forum").within(() => {
      cy.contains("p", "Color: White").should("be.visible");
      cy.contains("p", "Size: 10").should("be.visible");
      cy.get(".cart_details h4").should("have.text", "R1600");
      cy.get(".productDetails_counterValue").should("have.text", "2");
      cy.get("h4.cart_price").should("have.text", "R3200"); // 2 x R1600
    });
  });
  
  it("calculates the subtotal and total from price x quantity", () => {
    visitCartWith(clone([NIKE_ITEM, ADIDAS_ITEM]));
 
    subtotalText().should("have.text", `R${START_TOTAL}`);
    totalText().should("have.text", `R${START_TOTAL}`);
  });
 
  // ---------- Quantity ----------
  
  it("decreases the quantity and updates the line price and total", () => {
    visitCartWith(clone([NIKE_ITEM, ADIDAS_ITEM]));
 
    item("Adidas Low Forum").find("button.productDetails_decreaseBtn").click();
 
    item("Adidas Low Forum").within(() => {
      cy.get(".productDetails_counterValue").should("have.text", "1");
      cy.get("h4.cart_price").should("have.text", "R1600");
    });
    totalText().should("have.text", `R${START_TOTAL - 1600}`);
  });
 
  it("does not let the quantity drop below 1", () => {
    visitCartWith(clone([NIKE_ITEM, ADIDAS_ITEM]));
 
    item("Nike Air Force 1").find("button.productDetails_decreaseBtn").click();
 
    item("Nike Air Force 1")
      .find(".productDetails_counterValue")
      .should("have.text", "1");
    totalText().should("have.text", `R${START_TOTAL}`);
  });
 
  it("does not let the quantity go above the available stock", () => {
    visitCartWith(clone([NIKE_ITEM, ADIDAS_ITEM]));
 
    // Adidas: quantity 2, stock 10 -> 8 clicks reach the limit
    Cypress._.times(ADIDAS_ITEM.stockQuantity - ADIDAS_ITEM.quantity, () => {
      item("Adidas Low Forum").find("button.productDetails_increaseBtn").click();
    });
    item("Adidas Low Forum")
      .find(".productDetails_counterValue")
      .should("have.text", String(ADIDAS_ITEM.stockQuantity));
 
    item("Adidas Low Forum").find("button.productDetails_increaseBtn").click(); // one past the stock
    item("Adidas Low Forum")
      .find(".productDetails_counterValue")
      .should("have.text", String(ADIDAS_ITEM.stockQuantity));
    totalText().should("have.text", `R${1500 + 1600 * ADIDAS_ITEM.stockQuantity}`);
  });
 
  it("shows an empty cart with a R0 total after every item is removed", () => {
    visitCartWith(clone([NIKE_ITEM, ADIDAS_ITEM]));
 
    cy.get("button.cart_remove").first().click();
    cy.get("button.cart_remove").first().click();
 
    cy.get(".cart_item").should("not.exist");
    totalText().should("have.text", "R0");
    subtotalText().should("have.text", "R0");
  });
 
  it("does not go to checkout when the cart is empty", () => {
    visitCartWith(clone([NIKE_ITEM]));
 
    cy.get("button.cart_remove").click();
    cy.get(".cart_item").should("not.exist");
 
    cy.get("button.cart_checkout").click();
    cy.location("pathname").should("match", /\/cart$/i);
  });
 
 
  // ---------- Navigation ----------
 
  it("goes back to the products page with 'Continue Shopping'", () => {
    visitCartWith(clone([NIKE_ITEM]));
 
    cy.get("button.cart_continue").click();
    cy.location("pathname").should("eq", "/");
    cy.contains("h1.products_h1", "Products").should("be.visible");
  });
 
  it("goes to the checkout page with items in the cart", () => {
    visitCartWith(clone([NIKE_ITEM]));
 
    cy.get("button.cart_checkout").click();
    cy.location("pathname").should("match", /\/checkout$/i);
  });
 
  // ---------- Empty cart on load ----------
 
  it("shows no items and a R0 total when the cart starts empty", () => {
    // If your backend answers with an alert for an empty cart, Cypress accepts it
    cy.on("window:alert", () => {});
    visitCartWith([]);
 
    cy.get(".cart_item").should("not.exist");
    totalText().should("have.text", "R0");
  });
});
 
// ======================= ADD TO CART FROM THE PRODUCT PAGE =======================
describe("Adding an item to the cart from the product page", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/mycart/*").as("getCart");
    cy.intercept("PUT", "**/editcart/*").as("editCart");
    cy.intercept("POST", "**/selectedproduct/*").as("addToCart");
  });
 
  afterEach(() => {
    const name = Cypress.currentTest.title.replace(/\W+/g, "_").slice(0, 50);
    cy.screenshot(`Cart_${name}`, { capture: "runner" });
  });
 
  it("shows the item that was added, with the chosen colour, size and quantity", () => {
    loginRequest().then((session) => {
      seedCart(session, []); // start from an empty cart
      cy.visit(`${BASE}/`, { onBeforeLoad: setSession(session) });
    });
 
    // Products -> details
    cy.contains(".productsSection", "Nike Air Force 1")
      .find("button.productsBtn")
      .click();
    cy.location("pathname").should("match", /\/productdetails$/i);
 
    // Choose options and add to the cart
    cy.get("div.productDetails_shoeColor#Black").click();
    cy.contains("div.productDetails_shoeSize", /^9$/).click();
    cy.get("button.productDetails_increaseBtn").click(); // quantity -> 2
    cy.get("button.productDetails_AddToCartBtn").click();
    cy.wait("@addToCart").its("response.statusCode").should("be.oneOf", [200, 201]);
 
    // Cart page (loads the cart from the backend)
    cy.visit(`${BASE}/Cart`);
    cy.wait("@getCart");
 
    cy.get(".cart_item").should("have.length", 1);
    item("Nike Air Force 1").within(() => {
      cy.contains("p", "Color: Black").should("be.visible");
      cy.contains("p", "Size: 9").should("be.visible");
      cy.get(".productDetails_counterValue").should("have.text", "2");
      cy.get("h4.cart_price").should("have.text", "R3000");
    });
    totalText().should("have.text", "R3000");
  });
 
});