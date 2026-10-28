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
 
const SUBTOTAL = 1500 * 2 + 1600 * 1; // R4600
 
const clone = (items) => Cypress._.cloneDeep(items);
 
// Every run uses a unique address so the order can be found among old ones
// (orders from earlier runs stay in the database).
const uniqueCustomer = (label = "") => ({
  email: "cypress.buyer@gmail.com",
  phone: "071 234 5678",
  fullName: "Cypress Buyer",
  address: `${Date.now()}${label} Cypress Road, Sandton`,
  postalCode: "2196",
  city: "Johannesburg",
  province: "Gauteng",
});
 
// ---------- Helpers ----------
const loginRequest = (user = VALID_USER) =>
  cy
    .request("POST", `${BACKEND}/login`, {
      loginEmail: user.email,
      loginPassword: user.password,
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
 
// Creates an order through the API, the same call the Checkout page makes
const placeOrderViaApi = (session, items, customer, deliveryMethod = "150") => {
  seedCart(session, items);
  cy.request({
    method: "POST",
    url: `${BACKEND}/postcartinorder/${session.accessTokenUserId}`,
    headers: authHeaders(session),
    body: {
      deliveryMethod,
      fullName: customer.fullName,
      emailAddress: customer.email,
      phoneNumber: customer.phone,
      shippingAddress: customer.address,
      postalCode: customer.postalCode,
      city: customer.city,
      province: customer.province,
      totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    },
  })
    .its("status")
    .should("eq", 200);
};
 
const visitOrderStatus = (session) => {
  cy.visit(`${BASE}/OrderStatus`, { onBeforeLoad: setSession(session) });
  cy.wait("@getOrders");
};
 
const order = (address) => cy.contains(".orderTracking_orderCard", address);
 
// ======================= ORDER STATUS PAGE =======================
describe("Order status page", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/deliverystatus/*").as("getOrders");
  });
 
  afterEach(() => {
    const name = Cypress.currentTest.title.replace(/\W+/g, "_").slice(0, 50);
    cy.screenshot(`OrderStatus_${name}`, { capture: "runner" });
  });
 
  it("renders the page heading and subtitle", () => {
    loginRequest().then((session) => visitOrderStatus(session));
 
    cy.contains("h1.orderTracking_title", "Order Tracking").should("be.visible");
    cy.contains(
      "p.orderTracking_subtitle",
      "Track your order in real-time and check its delivery status."
    ).should("be.visible");
  });
 
 
  // ---------- A placed order ----------
 
  context("with an order that was just placed", () => {
    let customer;
 
    beforeEach(() => {
      customer = uniqueCustomer();
      loginRequest().then((session) => {
        placeOrderViaApi(session, clone([NIKE_ITEM, ADIDAS_ITEM]), customer);
        visitOrderStatus(session);
      });
    });
 
    it("shows the order summary with the total and status", () => {
      order(customer.address).within(() => {
        cy.contains(".orderTracking_summaryItem", "Order Number")
          .find(".orderTracking_summaryValue")
          .invoke("text")
          .should("not.be.empty");
        cy.contains(".orderTracking_summaryItem", "Order Date").should("be.visible");
        cy.contains(".orderTracking_summaryItem", "Order Total")
          .find(".orderTracking_summaryValue")
          .should("have.text", `R${SUBTOTAL}`);
        cy.contains(".orderTracking_summaryItem", "Status")
          .find(".orderTracking_statusBadge")
          .should("have.text", "In Transit");
      });
    });
 
    it("shows the delivery address that was entered at checkout", () => {
      order(customer.address).within(() => {
        cy.contains("h2.orderTracking_sectionTitle", "Delivery Details").should("be.visible");
        cy.contains(".orderTracking_deliveryItem", "Delivery Address")
          .find("p.orderTracking_deliveryText")
          .should("contain.text", customer.address)
          .and("contain.text", `${customer.city}, ${customer.postalCode}`)
          .and("contain.text", customer.province);
 
        cy.contains(".orderTracking_deliveryItem", "Estimated Delivery").should("be.visible");
        cy.contains(".orderTracking_deliveryItem", "Shipping Method").should("be.visible");
      });
    });
 
    it("lists every shoe in the order with its details", () => {
      order(customer.address).within(() => {
        cy.contains("h2.orderTracking_sectionTitle", "Order Items").should("be.visible");
        cy.get(".orderTracking_product").should("have.length", 2);
 
        cy.contains(".orderTracking_product", "Nike Air Force 1").within(() => {
          cy.get(".orderTracking_productDetails")
            .should("contain.text", "Color: Black")
            .and("contain.text", "Size: 9");
          cy.get(".orderTracking_productPrice").should("have.text", "R1500");
          cy.get(".orderTracking_productQuantity").should("have.text", "Qty: 2");
          cy.get(".orderTracking_productTotal").should("have.text", "R3000");
        });
 
        cy.contains(".orderTracking_product", "Adidas Low Forum").within(() => {
          cy.get(".orderTracking_productDetails")
            .should("contain.text", "Color: White")
            .and("contain.text", "Size: 10");
          cy.get(".orderTracking_productPrice").should("have.text", "R1600");
          cy.get(".orderTracking_productQuantity").should("have.text", "Qty: 1");
          cy.get(".orderTracking_productTotal").should("have.text", "R1600");
        });
      });
    });
 
    it("loads a real image for every shoe in the order", () => {
      order(customer.address)
        .find("img.orderStatus_shoeImage")
        .should("have.length", 2)
        .each(($img) => {
          expect($img.attr("src")).to.match(/^https?:\/\//);
          cy.wrap($img).should(($el) => {
            expect($el[0].naturalWidth, "image loaded").to.be.greaterThan(0);
          });
        });
    });
 
    it("still shows the order after the page is reloaded", () => {
      cy.reload();
      cy.wait("@getOrders");
      order(customer.address).should("be.visible");
    });
  });
 
  // ---------- Several orders ----------
 
  it("shows a separate card for each order the user has placed", () => {
    const first = uniqueCustomer("A");
    const second = uniqueCustomer("B");
 
    loginRequest().then((session) => {
      placeOrderViaApi(session, clone([NIKE_ITEM]), first);
      placeOrderViaApi(session, clone([ADIDAS_ITEM]), second);
      visitOrderStatus(session);
    });
 
    order(first.address).within(() => {
      cy.contains(".orderTracking_product", "Nike Air Force 1").should("be.visible");
      cy.contains(".orderTracking_product", "Adidas").should("not.exist");
    });
    order(second.address).within(() => {
      cy.contains(".orderTracking_product", "Adidas Low Forum").should("be.visible");
      cy.contains(".orderTracking_product", "Nike").should("not.exist");
    });
  });
 
  // ---------- A user who has never ordered ----------
 
  // ASSUMPTION: /deliverystatus answers with an empty list for a user with no
  // orders. If it returns something else (e.g. an error object) the page may
  // crash on .map - tell me what it returns and I'll adjust.
  it("shows no order cards for a brand-new user", () => {
    const newUser = { email: `cypress_new_${Date.now()}@gmail.com`, password: "qwerty78" };
 
    cy.request("POST", `${BACKEND}/signup`, {
      signupName: "New Cypress User",
      signupEmail: newUser.email,
      signupPassword: newUser.password,
      signupConfirmPassword: newUser.password,
    })
      .its("status")
      .should("eq", 200);
 
    loginRequest(newUser).then((session) => {
      cy.visit(`${BASE}/OrderStatus`, { onBeforeLoad: setSession(session) });
    });
    cy.wait("@getOrders");
 
    cy.contains("h1.orderTracking_title", "Order Tracking").should("be.visible");
    cy.get(".orderTracking_orderCard").should("not.exist");
  });
 
  // ---------- Known gaps in the app (un-skip once they are fixed) ----------
 
  // BUG: order number, order date, status, estimated delivery and shipping
  // method are hardcoded in OrderStatus.jsx, so every order looks identical.
  it("gives every order its own order number", () => {
    const first = uniqueCustomer("A");
    const second = uniqueCustomer("B");
 
    loginRequest().then((session) => {
      placeOrderViaApi(session, clone([NIKE_ITEM]), first);
      placeOrderViaApi(session, clone([ADIDAS_ITEM]), second);
      visitOrderStatus(session);
    });
 
    order(first.address)
      .contains(".orderTracking_summaryItem", "Order Number")
      .find(".orderTracking_summaryValue")
      .invoke("text")
      .then((firstNumber) => {
        order(second.address)
          .contains(".orderTracking_summaryItem", "Order Number")
          .find(".orderTracking_summaryValue")
          .invoke("text")
          .should("not.eq", firstNumber);
      });
  });
 
 });
 