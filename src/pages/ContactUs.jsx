import React, { useState, useEffect } from "react";
import "../styles/ContactUs.css";
import Navbar from "../components/Navbar";
import Footer2 from "../components/Footer2"

const ContactUs = () => {
  const [feedbackType, setFeedbackType] = useState("feedback");
  const [rating, setRating] = useState(0);

  // STATE VARIABLE THAT IS USED TO STORE THE NAMES OF ALL OF THE AVAILABLE SHOES
  const [allShoes, setAllshoes] = useState([]);

  // STATE VARIABLE THAT IS USED TO STORE ALL OF THE INFORMATION ABOUT A FORM THAT HAS BEEN SUBMITTED
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    orderNumber: "",
    message: ""
  })

  // STATE VARIABLE THAT IS USED TO STORE ALL OF THE INFORMATION ABOUT A FORM THAT HAS BEEN SUBMITTED
  const [shoeReview, setShoeReview] = useState({
    name: "",
    rating: "",
    subject: "",
    message: ""
  })

  // This function will submit the form that the user has filled in and store it inside of the database
  const submitForm = async (type) => {

    try {

      // Conditional statement checks to see if they are submitting a shoe review or if they are submitting an order review
      if (type === "form") {
        const { accessToken, accessTokenUserId } = JSON.parse(sessionStorage.getItem("KicksNationz"));
        const response = await fetch(`//localhost:3000/postforms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Basic ${accessToken}`
          },
          body: JSON.stringify({ ...formDetails })
        })


            const data = await response.json();

      if (response.status !== 200) {
        return alert(data.message);
      }

      else {
        alert(data.message);

        setShoeReview(()=>{
           return ({
    name: "",
    rating: "",
    subject: "",
    message: ""
  })
})


  setFormDetails(()=>{
           return ({
    name: "",
    email: "",
    orderNumber: "",
    message: ""
  })
})
      }


      }






      if (type === "review") {
        const { accessToken, accessTokenUserId } = JSON.parse(sessionStorage.getItem("KicksNationz"));
        const response = await fetch(`//localhost:3000/postforms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Basic ${accessToken}`
          },
          body: JSON.stringify({ ...shoeReview })
        })


            const data = await response.json();

      if (response.status !== 200) {
        return alert(data.message);
      }

      else {
        alert(data.message);

        setShoeReview(()=>{
           return ({
    name: "",
    rating: "",
    subject: "",
    message: ""
  })
})


  setFormDetails(()=>{
           return ({
    name: "",
    email: "",
    orderNumber: "",
    message: ""
  })
})
      }


      }



    } catch (error) {
      console.error(error);
    }
  }




  // THIS USEEFFECT WILL COLLECT ALL OF THE SHOE NAMES AND STORE IT IN TE DROPDOWN KNOWN AS SUBMIT FORM TO MAKE SURE THAT A USER IS ABLE TO SELECT A SHOE BASED ON THE ACTUAL SHOES INSIDE OF THE DATABASES
  useEffect(() => {

    const displayShoeDropdown = async () => {
      try {

        const { accessToken, accessTokenUserId } = JSON.parse(sessionStorage.getItem("KicksNationz"));
        const response = await fetch(`//localhost:3000/products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Basic ${accessToken}`
          }
        })

        const data = await response.json();

        if (response.status !== 200) {
          return alert("Unable to make a review on a shoe; please try again later or make a different review")
        }
        else {
          console.log("SHOE DATA", data.message)

          const shoeNames = data.message.map((item) => { return `${item.productName} ${item.shoeType}` }).sort();

          setAllshoes(() => { return [...shoeNames] })

          console.log("Shoes from the database: ", shoeNames.length)

        }
      }
      catch (error) {
        console.error(error)
      }
    }

    displayShoeDropdown();

  }, [])

  return (

    <div className="Contacts_page">
      <Navbar />

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

            >

              {/* Feedback Type */}
              <div className="Contacts_field">

                <label className="Contacts_label">
                  What is your feedback about?
                  <span className="Contacts_required">*</span>
                </label>

                <div className="Contacts_radioGroup">

                  <label
                    className={`Contacts_radioCard ${feedbackType === "feedback"
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
                    className={`Contacts_radioCard ${feedbackType === "product"
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
                  value={formDetails.name}
                  onChange={(event) => { setFormDetails((prevForm) => { return { ...prevForm, name: event.target.value } }) }}
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
                  value={formDetails.email}
                  onChange={(event) => { setFormDetails((prevForm) => { return { ...prevForm, email: event.target.value } }) }}
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
                  value={formDetails.orderNumber}
                  onChange={(event) => { setFormDetails((prevForm) => { return { ...prevForm, orderNumber: event.target.value } }) }}
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
                    value={formDetails.messsage}
                    onChange={(event) => { setFormDetails((prevForm) => { return { ...prevForm, message: event.target.value } }) }}
                  />

                  <span className="Contacts_characterCount">
                    0 / 1000
                  </span>

                </div>

              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={() => { return submitForm("form") }}
                className="Contacts_submitButton"
              >


                Send Feedback
              </button>

            </form>

          </div>

          {/* Review Form */}
          <div className="Contacts_card">

            <div className="Contacts_cardHeader">



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
                  onChange={(event) => { setShoeReview((prevForm) => { return { ...prevForm, name: event.target.value } }) }}
                >
                  {allShoes && allShoes.map((shoeName, index) => {
                    return (
                      <option key={index} value={shoeName} >
                        {shoeName}
                      </option>
                    )
                  })}

                </select>

              </div>

              {/* Rating */}
              <div className="Contacts_field">

                <label className="Contacts_label">
                  Your Rating
                  <span className="Contacts_required">*</span>
                </label>

                <div className="Contacts_rating">

                  {[1, 2, 3, 4, 5].map((star, index) => (
                    <button
                      type="button"
                      key={star}

                      id={star}
                      onClick={(event) => { setShoeReview((prevForm) => { return { ...prevForm, rating: event.target.id } }) }}

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
                  onChange={(event) => { setShoeReview((prevForm) => { return { ...prevForm, subject: event.target.value } }) }}
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
                    value={shoeReview.message}
                    onChange={(event) => { setShoeReview((prevForm) => { return { ...prevForm, message: event.target.value } }) }}

                  />

                  <span className="Contacts_characterCount">
                    0 / 1000
                  </span>

                </div>

              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={() => { return submitForm("review") }}
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

     

    </div>
  );
};

export default ContactUs;