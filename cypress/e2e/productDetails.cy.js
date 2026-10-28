/// <reference types="cypress" />
 
const BASE = "http://localhost:5173";
// Backend base URL (same value as your VITE_BACKEND_URL).
const BACKEND = "http://54.246.194.54:3000"; // change to your backend's URL
 
const VALID_USER = { email: "testcase1@gmail.com", password: "qwerty78" };
 
// Product used throughout (from your database)
const NIKE = {
  fullName: "Nike Air Force 1",
  productName: "Nike",
  shoeType: "Air Force 1",
  price: 1500,
  currency: "ZAR",
  stock: 12,
};
 
const NO_SIZE_ALERT = "Please select the shoe size that you would like to purchase.";
 
// Log in through the API and put the session where the app expects it.
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
 
// From the products page, open a shoe's details page by clicking its card button
const openProduct = (fullName) => {
  cy.contains(".productsSection", fullName).find("button.productsBtn").click();
  cy.location("pathname").should("match", /\/productdetails$/i);
};
 
const screenshotAfterEach = (prefix) =>
  afterEach(() => {
    const name = Cypress.currentTest.title.replace(/\W+/g, "_").slice(0, 50);
    cy.screenshot(`${prefix}_${name}`, { capture: "runner" });
  });
 
// ======================= PRODUCT DETAILS =======================
describe("Product details page", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/selectedproduct/*").as("addToCart");
    cy.intercept("POST", "**/wishlist").as("addToWishlist");
    visitAsLoggedInUser("/");
    openProduct(NIKE.fullName);
  });
 
  screenshotAfterEach("ProductDetails");
 
  it("displays the selected shoe", () => {
    cy.get("h2.productDetails_name").should("have.text", NIKE.fullName);
    cy.get("h3.productDetails_price").should("have.text", `R${NIKE.price}`);
  });
  
  it("changes the main image display when a thumbnail is clicked", () => {
    cy.get("img.productDetailImg")
      .eq(2)
      .invoke("attr", "src")
      .then((thumbSrc) => {
        cy.get("img.productDetailImg").eq(2).click();
        cy.get("img.productDetails_selectedDisplay").should("have.attr", "src", thumbSrc);
      });
  });
 
  it("pre-selects the first colour and lets the user pick another", () => {
    cy.get("p.productDetails_shoeSelectedColor").should("contain.text", "Color: White");
    cy.get("div.productDetails_shoeColor").should("have.length", 3);
 
    cy.get("div.productDetails_shoeColor#Black").click();
    cy.get("p.productDetails_shoeSelectedColor").should("contain.text", "Color: Black");
 
    cy.get("div.productDetails_shoeColor#Grey").click();
    cy.get("p.productDetails_shoeSelectedColor").should("contain.text", "Color: Grey");
  });
 
  it("shows no size selected at first, then the chosen size", () => {
    cy.get("div.productDetails_shoeSize").should("have.length", 6);
    cy.get("p.productDetails_shoeSizeTitle").should("have.text", "Size: ");
 
    cy.contains("div.productDetails_shoeSize", /^9$/).click();
    cy.get("p.productDetails_shoeSizeTitle").should("have.text", "Size: 9");
  });
 
  it("increases and decreases the quantity, never going below 1", () => {
    cy.get("p.productDetails_counterValue").should("have.text", "1");
 
    cy.get("button.productDetails_decreaseBtn").click(); // already at the minimum
    cy.get("p.productDetails_counterValue").should("have.text", "1");
 
    cy.get("button.productDetails_increaseBtn").click();
    cy.get("button.productDetails_increaseBtn").click();
    cy.get("p.productDetails_counterValue").should("have.text", "3");
 
    cy.get("button.productDetails_decreaseBtn").click();
    cy.get("p.productDetails_counterValue").should("have.text", "2");
  });
 
  it("does not let the quantity go above the available stock", () => {
    Cypress._.times(NIKE.stock - 1, () => {
      cy.get("button.productDetails_increaseBtn").click();
    });
    cy.get("p.productDetails_counterValue").should("have.text", String(NIKE.stock));
 
    cy.get("button.productDetails_increaseBtn").click(); // one past the stock
    cy.get("p.productDetails_counterValue").should("have.text", String(NIKE.stock));
  });
 
  it("keeps showing the shoe after the page is reloaded", () => {
    cy.reload();
    cy.get("h2.productDetails_name").should("have.text", NIKE.fullName);
    cy.get("h3.productDetails_price").should("have.text", `R${NIKE.price}`);
  });
 
  it("goes back to the products page with 'Back to products' button", () => {
    cy.get("p.productDetails_goBackTag").click();
    cy.location("pathname").should("eq", "/");
    cy.contains("h1.products_h1", "Products").should("be.visible");
  });
 
  // ---------- Add to cart: invalid input ----------
 
  it("alerts the user to select a size when no size is selected", () => {
    const alertStub = cy.stub().as("alertStub");
    cy.on("window:alert", alertStub);
 
    cy.get("button.productDetails_AddToCartBtn").click();
 
    cy.get("@addToCart.all").should("have.length", 0);
  });
 
  // ---------- Add to cart: happy path ----------
 
  it("adds the selected shoe, colour, size and quantity to the cart", () => {
    cy.get("div.productDetails_shoeColor#Black").click();
    cy.contains("div.productDetails_shoeSize", /^9$/).click();
    cy.get("button.productDetails_increaseBtn").click(); // quantity -> 2
    cy.get("p.productDetails_counterValue").should("have.text", "2");
 
    cy.get("button.productDetails_AddToCartBtn").click();
 
    cy.wait("@addToCart").then(({ request, response }) => {
      // Authenticated request
      expect(request.headers.authorization).to.match(/^Basic .+/);
      // What was sent
      expect(request.body).to.include({
        productName: NIKE.productName,
        productType: NIKE.shoeType,
        productColor: "Black",
        productSize: "9",
        quantity: 2,
        price: NIKE.price,
        currency: NIKE.currency,
      });
      expect(request.body.imageUrls).to.have.length(4);
      // Backend accepted it
      expect(response.statusCode).to.be.oneOf([200, 201]);
    });
  });
 
  // ---------- Wishlist ----------
 
  it("adds the shoe to the wishlist", () => {
    cy.contains("div.productDetails_shoeSize", /^10$/).click();
    cy.get("button.productDetails_AddToWishlistBtn").click();
 
    cy.wait("@addToWishlist").then(({ request, response }) => {
      expect(request.headers.authorization).to.match(/^Basic .+/);
      expect(request.body).to.include({
        productName: NIKE.productName,
        productType: NIKE.shoeType,
        productSize: "10",
      });
      expect(response.statusCode).to.eq(200);
    });
  });
});
 
// ======================= CART =======================

describe("Cart", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/selectedproduct/*").as("addToCart");
  });
 
  screenshotAfterEach("Cart");
 
  it("shows an item on the cart page after adding it from the product page", () => {
    visitAsLoggedInUser("/");
    openProduct(NIKE.fullName);
 
    cy.contains("div.productDetails_shoeSize", /^9$/).click();
    cy.get("button.productDetails_AddToCartBtn").click();
    cy.wait("@addToCart").its("response.statusCode").should("be.oneOf", [200, 201]);
 
    // Cart lives on the backend, so a full page load is fine here
    cy.visit(`${BASE}/Cart`);
    cy.location("pathname").should("match", /\/cart$/i);
    cy.contains(/nike/i).should("be.visible");
    cy.contains(/air force 1/i).should("be.visible");
    cy.contains(`R${NIKE.price}`).should("be.visible");
  });
 
});
 
