import React, { useState } from "react";
import "../styles/ContactUs.css";

const ContactUs = () => {
  const [feedbackType, setFeedbackType] = useState("feedback");
  const [rating, setRating] = useState(0);

  const handleFeedbackSubmit = (event) => {
    event.preventDefault();

    // Static design - prevent page refresh
    alert("Thank you for your feedback!");
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    // Static design - prevent page refresh
    alert("Thank you for your review!");
  };

  return (
    <div className="Contacts_page">


      {/* Main Content */}
      <main className="Contacts_main">

        {/* Page Heading */}
        <section className="Contacts_heading">

          <h1 className="Contacts_title">
            Contact Us
          </h1>

          <p className="Contacts_subtitle">
            We'd love to hear from you. Reach out to us or leave a review about your experience.
          </p>

        </section>

        {/* Forms */}
        <section className="Contacts_formsContainer">

          {/* Feedback Form */}
          <div className="Contacts_card">

            <div className="Contacts_cardHeader">

              <div className="Contacts_cardIcon">
                💬
              </div>

              <div>
                <h2 className="Contacts_cardTitle">
                  Share Your Feedback
                </h2>

                <p className="Contacts_cardDescription">
                  Let us know how we did or ask us anything.
                </p>
              </div>

            </div>

            <form
              className="Contacts_form"
              onSubmit={handleFeedbackSubmit}
            >

              {/* Feedback Type */}
              <div className="Contacts_field">

                <label className="Contacts_label">
                  What is your feedback about?
                  <span className="Contacts_required">*</span>
                </label>

                <div className="Contacts_radioGroup">

                  <label
                    className={`Contacts_radioCard ${
                      feedbackType === "feedback"
                        ? "Contacts_radioSelected"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name="feedbackType"
                      value="feedback"
                      checked={feedbackType === "feedback"}
                      onChange={(e) =>
                        setFeedbackType(e.target.value)
                      }
                      className="Contacts_radioInput"
                    />

                    <div className="Contacts_radioContent">

                      <span className="Contacts_radioTitle">
                        General feedback
                      </span>

                      <span className="Contacts_radioDescription">
                        Help us improve your shopping experience
                      </span>

                    </div>

                  </label>

                  <label
                    className={`Contacts_radioCard ${
                      feedbackType === "product"
                        ? "Contacts_radioSelected"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name="feedbackType"
                      value="product"
                      checked={feedbackType === "product"}
                      onChange={(e) =>
                        setFeedbackType(e.target.value)
                      }
                      className="Contacts_radioInput"
                    />

                    <div className="Contacts_radioContent">

                      <span className="Contacts_radioTitle">
                        Review a product
                      </span>

                      <span className="Contacts_radioDescription">
                        Share your thoughts about a shoe
                      </span>

                    </div>

                  </label>

                </div>

              </div>

              {/* Name */}
              <div className="Contacts_field">

                <label className="Contacts_label">
                  Your Name
                  <span className="Contacts_required">*</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="Contacts_input"
                  required
                />

              </div>

              {/* Email */}
              <div className="Contacts_field">

                <label className="Contacts_label">
                  Email Address
                  <span className="Contacts_required">*</span>
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="Contacts_input"
                  required
                />

              </div>

              {/* Order Number */}
              <div className="Contacts_field">

                <label className="Contacts_label">
                  Order Number
                  <span className="Contacts_optional">
                    (optional)
                  </span>
                </label>

                <input
                  type="text"
                  placeholder="Enter your order number"
                  className="Contacts_input"
                />

              </div>

              {/* Message */}
              <div className="Contacts_field">

                <label className="Contacts_label">
                  Your Message
                  <span className="Contacts_required">*</span>
                </label>

                <div className="Contacts_textareaWrapper">

                  <textarea
                    placeholder="Tell us how we can help or what you think..."
                    maxLength="1000"
                    className="Contacts_textarea"
                    required
                  />

                  <span className="Contacts_characterCount">
                    0 / 1000
                  </span>

                </div>

              </div>

              {/* Submit */}
              <button
                type="submit"
                className="Contacts_submitButton"
              >
                <span className="Contacts_buttonIcon">
                  ✉
                </span>

                Send Feedback
              </button>

            </form>

          </div>

          {/* Review Form */}
          <div className="Contacts_card">

            <div className="Contacts_cardHeader">

              <div className="Contacts_cardIcon">
                ☆
              </div>

              <div>
                <h2 className="Contacts_cardTitle">
                  Review a Shoe
                </h2>

                <p className="Contacts_cardDescription">
                  Share your experience with others.
                </p>
              </div>

            </div>

            <form
              className="Contacts_form"
              onSubmit={handleReviewSubmit}
            >

              {/* Shoe Selection */}
              <div className="Contacts_field">

                <label className="Contacts_label">
                  Select the shoe you want to review
                  <span className="Contacts_required">*</span>
                </label>

                <select
                  className="Contacts_select"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a shoe
                  </option>

                  <option value="nike-air-force">
                    Nike Air Force 1
                  </option>

                  <option value="adidas-forum">
                    Adidas Forum Low
                  </option>

                  <option value="nike-dunk">
                    Nike Dunk Low
                  </option>

                  <option value="adidas-campus">
                    Adidas Campus
                  </option>

                </select>

              </div>

              {/* Rating */}
              <div className="Contacts_field">

                <label className="Contacts_label">
                  Your Rating
                  <span className="Contacts_required">*</span>
                </label>

                <div className="Contacts_rating">

                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`Contacts_starButton ${
                        star <= rating
                          ? "Contacts_starActive"
                          : ""
                      }`}
                      aria-label={`Rate ${star} out of 5`}
                    >
                      ★
                    </button>
                  ))}

                </div>

              </div>

              {/* Review Subject */}
              <div className="Contacts_field">

                <label className="Contacts_label">
                  Your Review Subject
                  <span className="Contacts_required">*</span>
                </label>

                <select
                  className="Contacts_select"
                  required
                  defaultValue=""
                >

                  <option value="" disabled>
                    Select a review subject
                  </option>

                  <option value="quality">
                    Product Quality
                  </option>

                  <option value="comfort">
                    Comfort
                  </option>

                  <option value="design">
                    Design
                  </option>

                  <option value="value">
                    Value for Money
                  </option>

                  <option value="delivery">
                    Delivery Experience
                  </option>

                </select>

              </div>

              {/* Review */}
              <div className="Contacts_field">

                <label className="Contacts_label">
                  Your Review
                  <span className="Contacts_required">*</span>
                </label>

                <div className="Contacts_textareaWrapper">

                  <textarea
                    placeholder="Write your review about this shoe..."
                    maxLength="1000"
                    className="Contacts_textarea Contacts_reviewTextarea"
                    required
                  />

                  <span className="Contacts_characterCount">
                    0 / 1000
                  </span>

                </div>

              </div>

              {/* Submit */}
              <button
                type="submit"
                className="Contacts_submitButton"
              >

                <span className="Contacts_buttonIcon">
                  ☆
                </span>

                Submit Review

              </button>

            </form>

          </div>

        </section>

      </main>

      {/* Features Section */}
      <section className="Contacts_features">

        <div className="Contacts_feature">

          <div className="Contacts_featureIcon">
            ♢
          </div>

          <div className="Contacts_featureContent">

            <h3 className="Contacts_featureTitle">
              100% Authentic
            </h3>

            <p className="Contacts_featureText">
              Genuine products only
            </p>

          </div>

        </div>

        <div className="Contacts_feature">

          <div className="Contacts_featureIcon">
            ▱
          </div>

          <div className="Contacts_featureContent">

            <h3 className="Contacts_featureTitle">
              Fast Delivery
            </h3>

            <p className="Contacts_featureText">
              Quick & reliable shipping
            </p>

          </div>

        </div>

        <div className="Contacts_feature">

          <div className="Contacts_featureIcon">
            ◉
          </div>

          <div className="Contacts_featureContent">

            <h3 className="Contacts_featureTitle">
              Easy Returns
            </h3>

            <p className="Contacts_featureText">
              Hassle-free returns within
              <br />
              14 days.
            </p>

          </div>

        </div>

        <div className="Contacts_feature">

          <div className="Contacts_featureIcon">
            ♧
          </div>

          <div className="Contacts_featureContent">

            <h3 className="Contacts_featureTitle">
              24/7 Support
            </h3>

            <p className="Contacts_featureText">
              We're here to help you
              <br />
              24/7.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
};

export default ContactUs;