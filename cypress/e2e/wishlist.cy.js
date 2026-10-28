/// <reference types="cypress" />
 
const BASE = "http://localhost:5173";
// Backend base URL (same value as your VITE_BACKEND_URL).
const BACKEND = "http://54.246.194.54:3000"; // change to your backend's URL
 
const VALID_USER = { email: "testcase1@gmail.com", password: "qwerty78" };
 
// ---------- Test data (matches your database) ----------
const NIKE = {
  productId: "6a8758b0a8cafeed63f97739",
  quantity: 1,
  productName: "Nike",
  productType: "Air Force 1",
  productColor: ["White", "Black", "Grey"],
  productSize: "9",
  currency: "ZAR",
  price: 1500,
  imageUrls: [
    "https://emkfvwszklugneydgumh.supabase.co/storage/v1/object/public/venues/images/1787253154608-4c285098ee259cb9aae122c5b99639c0.jpg",
    "https://emkfvwszklugneydgumh.supabase.co/storage/v1/object/public/venues/images/1787253154609-92b5a25388f40d57c2dbb117b6705b7c.jpg",
    "https://emkfvwszklugneydgumh.supabase.co/storage/v1/object/public/venues/images/1787253154609-8033a49a1af88a4e4b3e22abd2795173.jpg",
    "https://emkfvwszklugneydgumh.supabase.co/storage/v1/object/public/venues/images/1787253154609-ec9bf79fd0062487db3a71eadb75d467.jpg",
  ],
  stockQuantity: 12,
};
 
const ADIDAS = {
  productId: "6a8758a8a8cafeed63f97736",
  quantity: 1,
  productName: "Adidas",
  productType: "Low Forum",
  productColor: ["White", "Black", "Grey"],
  productSize: "10",
  currency: "ZAR",
  price: 1600,
  imageUrls: [
    "https://emkfvwszklugneydgumh.supabase.co/storage/v1/object/public/venues/images/1787254889520-3e071422d8a2d04a51fbb535ee5a0a36.jpg",
    "https://emkfvwszklugneydgumh.supabase.co/storage/v1/object/public/venues/images/1787254889520-9d60cd5c45d6d0def81b7ba8d34b07f3.jpg",
  ],
  stockQuantity: 10,
};
 
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
 
// Empties the user's wishlist through the API (removes position 0 until none are left)
const clearWishlist = (session) => {
  cy.request({
    url: `${BACKEND}/mywishlist/${session.accessTokenUserId}`,
    headers: authHeaders(session),
    failOnStatusCode: false,
  }).then((res) => {
    const items =
      (res.status === 200 && res.body.message && res.body.message.wishlistCart) || [];
    Cypress._.times(items.length, () => {
      cy.request({
        method: "POST",
        url: `${BACKEND}/removeFromWishlist/${session.accessTokenUserId}`,
        headers: authHeaders(session),
        body: { position: 0 },
      });
    });
  });
};
 
// Empties the cart (make sure one exists, then overwrite it with nothing)
const clearCart = (session) => {
  cy.request({
    method: "POST",
    url: `${BACKEND}/selectedproduct/${session.accessTokenUserId}`,
    headers: authHeaders(session),
    body: { ...NIKE, productColor: "Black" },
    failOnStatusCode: false,
  });
  cy.request({
    method: "PUT",
    url: `${BACKEND}/editcart/${session.accessTokenUserId}`,
    headers: authHeaders(session),
    body: { shoppingCart: [], totalPrice: 0 },
  });
};
 
// Resets the wishlist to exactly the given items
const seedWishlist = (session, items) => {
  clearWishlist(session);
  items.forEach((shoe) => {
    cy.request({
      method: "POST",
      url: `${BACKEND}/wishlist`,
      headers: authHeaders(session),
      body: { ...shoe, encodedEmail: session.accessTokenUserId },
    });
  });
};
 
// Seed the wishlist (and optionally empty the cart), then open /Wishlist as a logged-in user
const visitWishlistWith = (items, { emptyCart = false } = {}) => {
  loginRequest().then((session) => {
    seedWishlist(session, items);
    if (emptyCart) clearCart(session);
    cy.visit(`${BASE}/Wishlist`, { onBeforeLoad: setSession(session) });
  });
  cy.wait("@getWishlist");
};
 
const shoe = (fullName) => cy.contains(".wishlist_item", fullName);
const countText = () => cy.get(".wishlist_header p");
 
// ======================= WISHLIST PAGE =======================
describe("Wishlist page", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/mywishlist/*").as("getWishlist");
    cy.intercept("POST", "**/removeFromWishlist/*").as("removeFromWishlist");
    cy.intercept("PUT", "**/editwishlist/*").as("editWishlist");
    cy.intercept("POST", "**/moveAllToCart/*").as("moveAllToCart");
  });
 
  afterEach(() => {
    const name = Cypress.currentTest.title.replace(/\W+/g, "_").slice(0, 50);
    cy.screenshot(`Wishlist_${name}`, { capture: "runner" });
  });
 
  // ---------- Display ----------
 
  it("renders the wishlist header and the 'Move All to Cart' button", () => {
    visitWishlistWith([NIKE, ADIDAS]);
 
    cy.contains("h1", "My Wishlist").should("be.visible");
    cy.contains("button.wishlist_moveAllBtn", "Move All to Cart").should("be.visible");
  });
 
  it("shows how many items are saved (plural)", () => {
    visitWishlistWith([NIKE, ADIDAS]);
 
    countText().invoke("text").should("match", /^\s*2 items saved for later$/);
    cy.get(".wishlist_item").should("have.length", 2);
  });
 
  it("shows the singular wording for exactly one item", () => {
    visitWishlistWith([NIKE]);
 
    countText().invoke("text").should("match", /^\s*1 item saved for later$/);
    cy.get(".wishlist_item").should("have.length", 1);
  });
 
  it("shows 0 items and no cards when the wishlist is empty", () => {
    visitWishlistWith([]);
 
    countText().invoke("text").should("match", /^\s*0 items saved for later$/);
    cy.get(".wishlist_item").should("not.exist");
  });
 
  it("displays each shoe's name, price, colour, size, date and buttons", () => {
    visitWishlistWith([NIKE, ADIDAS]);
 
     shoe("Adidas Low Forum").within(() => {
      cy.get("h3").should("have.text", "R1600");
      cy.get(".wishlist_productSize span").should("have.text", "Size: 10");
    });

   
  });
 
  it("shows a thumbnail for every image and loads the main image", () => {
    visitWishlistWith([NIKE]);
 
    shoe("Nike Air Force 1").within(() => {
      cy.get(".wishlist_imgSelection img").should("have.length", NIKE.imageUrls.length);
      cy.get(".wishlist_mainImage img")
        .should("have.attr", "src", NIKE.imageUrls[0])
        .and(($img) => {
          expect($img[0].naturalWidth, "image loaded").to.be.greaterThan(0);
        });
    });
  });
 
  // ---------- Interaction ----------
 
  it("changes the main image when a thumbnail is clicked", () => {
    visitWishlistWith([NIKE]);
 
    shoe("Nike Air Force 1").within(() => {
      cy.get(".wishlist_imgSelection img").eq(2).click();
      cy.get(".wishlist_mainImage img").should("have.attr", "src", NIKE.imageUrls[2]);
    });
  });
 
  it("lets the user pick a colour for each shoe independently", () => {
    visitWishlistWith([NIKE, ADIDAS]);
 
    shoe("Nike Air Force 1").find(".wishlist_shoeColor#Black").click();
    shoe("Nike Air Force 1")
      .find("p.wishlist_selectedShoeColor")
      .should("contain.text", "Color: Black");
 
    // The other shoe keeps its default colour
    shoe("Adidas Low Forum")
      .find("p.wishlist_selectedShoeColor")
      .should("contain.text", "Color: Black");
 
    shoe("Adidas Low Forum").find(".wishlist_shoeColor#Grey").click();
    shoe("Adidas Low Forum")
      .find("p.wishlist_selectedShoeColor")
      .should("contain.text", "Color: Grey");

  });
 
  // ---------- Remove ----------
 
  it("removes a shoe from the wishlist and updates the count", () => {
    visitWishlistWith([NIKE, ADIDAS]);
 
    shoe("Adidas Low Forum").find("button.wishlist_removeBtn").click();
 
    cy.wait("@removeFromWishlist").then(({ request, response }) => {
      expect(request.headers.authorization).to.match(/^Basic .+/);
      expect(request.body.position).to.eq(0);
      expect(response.statusCode).to.eq(200);
    });
 
    cy.get(".wishlist_item").should("have.length", 1);
    cy.contains(".wishlist_item", "Adidas").should("not.exist");
    shoe("Nike Air Force 1").should("be.visible");
    countText().invoke("text").should("match", /^\s*1 item saved for later$/);
  });
 
  it("shows an empty wishlist after the last shoe is removed", () => {
    visitWishlistWith([NIKE]);
 
    cy.get("button.wishlist_removeBtn").click();
    cy.wait("@removeFromWishlist").its("response.statusCode").should("eq", 200);
 
    cy.get(".wishlist_item").should("not.exist");
    countText().invoke("text").should("match", /^\s*0 items saved for later$/);
  });
 
   // ---------- Move all ----------
 
  it("moves every shoe to the cart at once", () => {
    const alertStub = cy.stub().as("alertStub");
    cy.on("window:alert", alertStub);
    visitWishlistWith([NIKE, ADIDAS], { emptyCart: true });
 
    // Choose Black for the Nike; leave the Adidas on its default colour (White)
    shoe("Nike Air Force 1").find(".wishlist_shoeColor#Black").click();
    cy.get("button.wishlist_moveAllBtn").click();
 
    cy.wait("@moveAllToCart").then(({ request, response }) => {
      expect(request.headers.authorization).to.match(/^Basic .+/);
      expect(request.body.wishlistArray).to.have.length(2);
      // Each shoe is sent with ONE colour: the chosen one, or the first by default
      expect(request.body.wishlistArray[0].productColor).to.eq("Black");
      expect(request.body.wishlistArray[1].productColor).to.eq("White");
      expect(response.statusCode).to.eq(200);
    });
 
    cy.get(".wishlist_item").should("not.exist");
    countText().invoke("text").should("match", /^\s*0 items saved for later$/);
 
    // Both shoes are now in the cart
    cy.intercept("GET", "**/mycart/*").as("getCart");
    cy.visit(`${BASE}/Cart`);
    cy.wait("@getCart");
    cy.get(".cart_item").should("have.length", 2);
    cy.contains(".cart_item", "Nike Air Force 1")
      .contains("p", "Color: White")
      .should("be.visible");
    cy.contains(".cart_item", "Adidas Low Forum")
      .contains("p", "Color: Black")
      .should("be.visible");
  });
 
});
 
// ======================= ADD TO WISHLIST FROM THE PRODUCT PAGE =======================
describe("Adding a shoe to the wishlist from the product page", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/mywishlist/*").as("getWishlist");
    cy.intercept("POST", "**/wishlist").as("addToWishlist");
  });
 
  afterEach(() => {
    const name = Cypress.currentTest.title.replace(/\W+/g, "_").slice(0, 50);
    cy.screenshot(`Wishlist_${name}`, { capture: "runner" });
  });
 
  it("shows the shoe on the wishlist page after it is added", () => {
    loginRequest().then((session) => {
      clearWishlist(session); // start from an empty wishlist
      cy.visit(`${BASE}/`, { onBeforeLoad: setSession(session) });
    });
 
    // Products -> details
    cy.contains(".productsSection", "Nike Air Force 1")
      .find("button.productsBtn")
      .click();
    cy.location("pathname").should("match", /\/productdetails$/i);
 
    // Add to wishlist with a chosen size
    cy.contains("div.productDetails_shoeSize", /^10$/).click();
    cy.get("button.productDetails_AddToWishlistBtn").click();
    cy.wait("@addToWishlist").its("response.statusCode").should("eq", 200);
 
    // Wishlist page
    cy.visit(`${BASE}/Wishlist`);
    cy.wait("@getWishlist");
    cy.get(".wishlist_item").should("have.length", 1);
    shoe("Nike Air Force 1").within(() => {
      cy.get("h3").should("have.text", "R1500");
      cy.get(".wishlist_productSize span").should("have.text", "Size: 10");
    });
    countText().invoke("text").should("match", /^\s*1 item saved for later$/);
  });
});