/// <reference types="cypress" />
 
const BASE = "http://localhost:5173";
// Backend base URL (same value as your VITE_BACKEND_URL).
const BACKEND = "http://54.246.194.54:3000"; // change to your backend's URL
 
const VALID_USER = { email: "testcase1@gmail.com", password: "qwerty78" };
 
// ---------- Test data (matches your database) ----------
const NIKE_ITEM = {
  productId: "6a8758b0a8cafeed63f97739",
  quantity: 2,
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
  quantity: 1,
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
 
const SHIPPING = 150; // what your page currently shows for any non-empty cart
const SUBTOTAL = 1500 * 2 + 1600 * 1; // R4600
const TOTAL = SUBTOTAL + SHIPPING; // R4750
 
const CUSTOMER = {
  email: "cypress.buyer@gmail.com",
  phone: "071 234 5678",
  fullName: "Cypress Buyer",
  address: "12 Test Street, Sandton",
  postalCode: "2196",
  city: "Johannesburg",
  province: "Gauteng",
  cardNumber: "4111 1111 1111 1111",
  expiry: "12 / 30",
  cvv: "123",
};
 
const clone = (items) => Cypress._.cloneDeep(items);
 
// ---------- Helpers ----------
const loginRequest = () =>
  cy
    .request("POST", `${BACKEND}/login`, {
      loginEmail: VALID_USER.email,
      loginPassword: VALID_USER.password,
    })
    .its("body");
 
const authHeaders = (session) => ({
  "Content-Type": "application/json",
  authorization: `Basic ${session.generatedToken}`,
});
 
const setSession = (session) => (win) =>
  win.sessionStorage.setItem(
    "KicksNationz",
    JSON.stringify({
      accessToken: session.generatedToken,
      accessTokenUserId: session.accessTokenUserId,
      isLoggedIn: true,
    })
  );
 
// Put the cart in a known state: make sure one exists (POST), then overwrite it (PUT)
const seedCart = (session, items) => {
  cy.request({
    method: "POST",
    url: `${BACKEND}/selectedproduct/${session.accessTokenUserId}`,
    headers: authHeaders(session),
    body: NIKE_ITEM,
    failOnStatusCode: false,
  });
  cy.request({
    method: "PUT",
    url: `${BACKEND}/editcart/${session.accessTokenUserId}`,
    headers: authHeaders(session),
    body: {
      shoppingCart: items,
      totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    },
  });
};
 
const visitCheckoutWith = (items) => {
  loginRequest().then((session) => {
    seedCart(session, items);
    cy.visit(`${BASE}/Checkout`, { onBeforeLoad: setSession(session) });
  });
  cy.wait("@getCart");
};
 
// The checkout inputs have no id/name, so they are found by placeholder
const field = {
  email: () => cy.get("input[placeholder='example@email.com']"),
  phone: () => cy.get("input[placeholder='071 234 5678']"),
  fullName: () => cy.get("input[placeholder='John Doe']"),
  address: () => cy.get("input[placeholder='123 Main Street, Green Point']"),
  postalCode: () => cy.get("input[placeholder='8001']"),
  city: () => cy.get("input[placeholder='Cape Town']"),
  province: () => cy.get("input[placeholder='Western Cape']"),
  cardNumber: () => cy.get("input[placeholder='1234 5678 9012 3456']"),
  expiry: () => cy.get("input[placeholder='MM / YY']"),
  cvv: () => cy.get("input[placeholder='123']"),
  delivery: () => cy.get("select.checkout_select"),
};
 
const fillCheckoutForm = (c = CUSTOMER) => {
  field.email().type(c.email);
  field.phone().type(c.phone);
  field.fullName().type(c.fullName);
  field.address().type(c.address);
  field.postalCode().type(c.postalCode);
  field.city().type(c.city);
  field.province().type(c.province);
  field.cardNumber().type(c.cardNumber);
  field.expiry().type(c.expiry);
  field.cvv().type(c.cvv);
};
 
const placeOrderButton = () => cy.contains("button.checkout_place_order", "Place Order");
const priceRow = (label) => cy.contains(".checkout_price_row", label).find("strong");
const product = (name) => cy.contains(".checkout_product", name);
 
// ======================= CHECKOUT PAGE =======================
describe("Checkout page", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/mycart/*").as("getCart");
    cy.intercept("POST", "**/postcartinorder/*").as("placeOrder");
  });
 
  afterEach(() => {
    const name = Cypress.currentTest.title.replace(/\W+/g, "_").slice(0, 50);
    cy.screenshot(`Checkout_${name}`, { capture: "runner" });
  });
 
  // ---------- Display ----------
 
  it("renders the checkout page layout", () => {
    visitCheckoutWith(clone([NIKE_ITEM, ADIDAS_ITEM]));
 
    cy.contains("h1.checkout_title", "Checkout").should("be.visible");
    cy.contains("p.checkout_subtitle", "Complete your order").should("be.visible");
 
    ["1. Contact Information", "2. Shipping Address", "3. Delivery Method", "4. Payment Method"]
      .forEach((title) => {
        cy.contains("h2.checkout_section_title", title).should("be.visible");
      });
 
    cy.contains("h2.checkout_summary_title", "Order Summary").should("be.visible");
    placeOrderButton().should("be.visible");
    cy.contains("button.checkout_place_order", "Back to cart").should("be.visible");
    cy.contains("h3.checkout_secure_title", "Secure Checkout").should("be.visible");
  });
 
  it("lists every cart item in the order summary", () => {
    visitCheckoutWith(clone([NIKE_ITEM, ADIDAS_ITEM]));
 
    cy.get(".checkout_product").should("have.length", 2);
 
    product("Nike").within(() => {
      cy.get("h3.checkout_product_name").should("have.text", "Nike");
      cy.contains("p", "Color: Black").should("be.visible");
      cy.contains("p", "Size: 9").should("be.visible");
      cy.contains("span", "Quantity: 2").should("be.visible");
      cy.get("strong").should("have.text", "R3000"); // 2 x R1500
    });
 
    product("Adidas").within(() => {
      cy.contains("p", "Color: White").should("be.visible");
      cy.contains("p", "Size: 10").should("be.visible");
      cy.contains("span", "Quantity: 1").should("be.visible");
      cy.get("strong").should("have.text", "R1600");
    });
  });
 
  it("shows the subtotal, shipping and total", () => {
    visitCheckoutWith(clone([NIKE_ITEM, ADIDAS_ITEM]));
 
    priceRow("Subtotal").should("have.text", `R${SUBTOTAL}`);
    priceRow("Shipping").should("have.text", `R${SHIPPING}`);
    cy.get(".checkout_total strong").invoke("text").then((t) => {
      expect(t.replace(/\s/g, "")).to.eq(`R${TOTAL}`);
    });
  });
 
  it("shows R0 everywhere when the cart is empty", () => {
    visitCheckoutWith([]);
 
    cy.get(".checkout_product").should("not.exist");
    priceRow("Subtotal").should("have.text", "R0");
    priceRow("Shipping").should("have.text", "R0");
    cy.get(".checkout_total strong").invoke("text").then((t) => {
      expect(t.replace(/\s/g, "")).to.eq("R0");
    });
  });
 
  // ---------- Form inputs ----------
 
  it("accepts the customer's contact, shipping and card details", () => {
    visitCheckoutWith(clone([NIKE_ITEM]));
    fillCheckoutForm();
 
    field.email().should("have.value", CUSTOMER.email);
    field.phone().should("have.value", CUSTOMER.phone);
    field.fullName().should("have.value", CUSTOMER.fullName);
    field.address().should("have.value", CUSTOMER.address);
    field.postalCode().should("have.value", CUSTOMER.postalCode);
    field.city().should("have.value", CUSTOMER.city);
    field.province().should("have.value", CUSTOMER.province);
    field.cardNumber().should("have.value", CUSTOMER.cardNumber);
    field.expiry().should("have.value", CUSTOMER.expiry);
    field.cvv().should("have.value", CUSTOMER.cvv);
  });
 
  it("offers standard and express delivery, with standard selected by default", () => {
    visitCheckoutWith(clone([NIKE_ITEM]));
 
    field.delivery().find("option").should("have.length", 2);
    field.delivery().find("option:selected").should("contain.text", "Standard Delivery");
 
    field.delivery().select("Express Delivery (1-2 business days)");
    field.delivery().should("have.value", "100");
    field.delivery().select("Standard Delivery (2-4 business days)");
    field.delivery().should("have.value", "150");
  });
 
  it("has card payment selected by default and lets the user switch to PayPal", () => {
    visitCheckoutWith(clone([NIKE_ITEM]));
 
    cy.contains("label.checkout_radio_option", "Credit / Debit Card")
      .find("input[type='radio']")
      .should("be.checked");
 
    cy.contains("label.checkout_radio_option", "PayPal").find("input[type='radio']").check();
    cy.contains("label.checkout_radio_option", "PayPal")
      .find("input[type='radio']")
      .should("be.checked");
    cy.contains("label.checkout_radio_option", "Credit / Debit Card")
      .find("input[type='radio']")
      .should("not.be.checked");
  });
 
  // ---------- Place order ----------
 
  it("places an order with the entered details and clears the page", () => {
    visitCheckoutWith(clone([NIKE_ITEM, ADIDAS_ITEM]));
 
    fillCheckoutForm();
    field.delivery().select("Express Delivery (1-2 business days)");
    placeOrderButton().click();
 
    cy.wait("@placeOrder").then(({ request, response }) => {
      expect(request.headers.authorization).to.match(/^Basic .+/);
      expect(request.body).to.include({
        deliveryMethod: "100",
        fullName: CUSTOMER.fullName,
        emailAddress: CUSTOMER.email,
        phoneNumber: CUSTOMER.phone,
        shippingAddress: CUSTOMER.address,
        postalCode: CUSTOMER.postalCode,
        city: CUSTOMER.city,
        province: CUSTOMER.province,
        totalPrice: SUBTOTAL,
      });
      expect(response.statusCode).to.eq(200);
    });
 
    // The form and summary are reset
    field.email().should("have.value", "");
    field.fullName().should("have.value", "");
    field.address().should("have.value", "");
    field.cardNumber().should("have.value", "");
    field.cvv().should("have.value", "");
    cy.get(".checkout_product").should("not.exist");
    priceRow("Subtotal").should("have.text", "R0");
  });
 
  it("never sends the card number, expiry date or CVV to the server", () => {
    visitCheckoutWith(clone([NIKE_ITEM]));
 
    fillCheckoutForm();
    placeOrderButton().click();
 
    cy.wait("@placeOrder").then(({ request }) => {
      expect(request.body).to.not.have.any.keys("cardNumber", "expireryDate", "expiryDate", "CVV", "cvv");
      const raw = JSON.stringify(request.body);
      expect(raw).to.not.contain(CUSTOMER.cardNumber);
      expect(raw).to.not.contain(CUSTOMER.cvv + '"');
    });
  });
 
  // ASSUMPTION: after an order, your backend empties the cart. If it keeps the
  // cart, change this to whatever your app should do.
  it("leaves the cart empty after an order is placed", () => {
    visitCheckoutWith(clone([NIKE_ITEM, ADIDAS_ITEM]));
 
    fillCheckoutForm();
    placeOrderButton().click();
    cy.wait("@placeOrder").its("response.statusCode").should("eq", 200);
 
    cy.intercept("GET", "**/mycart/*").as("getCartAfter");
    cy.visit(`${BASE}/Cart`);
    cy.wait("@getCartAfter");
    cy.get(".cart_item").should("not.exist");
  });
 
  // ---------- Navigation ----------
 
  it("goes back to the cart with 'Back to cart'", () => {
    visitCheckoutWith(clone([NIKE_ITEM]));
 
    cy.contains("button.checkout_place_order", "Back to cart").click();
    cy.location("pathname").should("match", /\/cart$/i);
    cy.contains("h1.cart_heading", "Your Cart").should("be.visible");
  });
 
});
// ======================= FULL SHOPPING JOURNEY =======================
describe("Full journey: product page -> cart -> checkout", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/mycart/*").as("getCart");
    cy.intercept("POST", "**/selectedproduct/*").as("addToCart");
    cy.intercept("POST", "**/postcartinorder/*").as("placeOrder");
  });
 
  afterEach(() => {
    const name = Cypress.currentTest.title.replace(/\W+/g, "_").slice(0, 50);
    cy.screenshot(`Checkout_${name}`, { capture: "runner" });
  });
 
  it("adds a shoe, reviews the cart and places the order", () => {
    loginRequest().then((session) => {
      seedCart(session, []); // start from an empty cart
      cy.visit(`${BASE}/`, { onBeforeLoad: setSession(session) });
    });
 
    // Pick a shoe and add it
    cy.contains(".productsSection", "Nike Air Force 1").find("button.productsBtn").click();
    cy.get("div.productDetails_shoeColor#Black").click();
    cy.contains("div.productDetails_shoeSize", /^9$/).click();
    cy.get("button.productDetails_AddToCartBtn").click();
    cy.wait("@addToCart").its("response.statusCode").should("be.oneOf", [200, 201]);
 
    // Cart -> Checkout
    cy.visit(`${BASE}/Cart`);
    cy.wait("@getCart");
    cy.get(".cart_item").should("have.length", 1);
    cy.get("button.cart_checkout").click();
    cy.location("pathname").should("match", /\/checkout$/i);
    cy.wait("@getCart");
 
    // The summary matches what was added
    cy.get(".checkout_product").should("have.length", 1);
    product("Nike").within(() => {
      cy.contains("p", "Color: Black").should("be.visible");
      cy.contains("p", "Size: 9").should("be.visible");
      cy.contains("span", "Quantity: 1").should("be.visible");
    });
    priceRow("Subtotal").should("have.text", "R1500");
 
    // Pay
    fillCheckoutForm();
    placeOrderButton().click();
    cy.wait("@placeOrder").then(({ request, response }) => {
      expect(request.body.totalPrice).to.eq(1500);
      expect(request.body.fullName).to.eq(CUSTOMER.fullName);
      expect(response.statusCode).to.eq(200);
    });
    cy.get(".checkout_product").should("not.exist");
  });
});