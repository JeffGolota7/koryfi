import React from "react";
import { Link } from "react-router-dom";
import "../styles/About.css";

export default function Home() {
  return (
    <div className="aboutContainer">
      <div className="aboutHero">
        <img className="aboutImg1 aboutImg" src="./images/image 1.png" alt="" />
        <img className="aboutImg2 aboutImg" src="./images/image 2.png" alt="" />
        <img className="aboutImg3 aboutImg" src="./images/image 3.png" alt="" />
        <img className="aboutImg4 aboutImg" src="./images/image 4.png" alt="" />
      </div>
      <div className="aboutJourney">
        <div className="aboutJourneyContent">
          <div className="aboutJourneyHeader">
            <h2>Redefining adventure with innovative gear.</h2>
            <hr />
          </div>
          <div className="journeyBlurbs">
            <div className="blurbContainer">
              <p className="blurb">
                From humble beginnings, our passion for winter sports has driven
                us to where we are today.
              </p>
              <p className="blurb">
                Through years of hard work and dedication, we've become a
                leading player in the winter sports industry.
              </p>
              <p className="blurb">
                We started with a simple dream and a lot of determination, and
                now we're proud to offer top-quality products to snow
                enthusiasts worldwide.
              </p>
              <p className="blurb">
                What began as a small operation in our garage has grown into a
                thriving business, thanks to our unwavering commitment to
                quality and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="finalSection">
        <div className="finalSectionText">
          <p>
            Our company was founded on the belief that outdoor gear should be
            made with quality materials, innovative design, and a commitment to
            sustainability. We strive to create products that not only perform
            well but also have a positive impact on the environment. Our team is
            passionate about the outdoors and dedicated to providing our
            customers with the best possible experience on their adventures. We
            believe that by creating high-quality outdoor gear, we can inspire
            people to explore the world around them and make lasting memories.
          </p>
          <Link to="/products">
            <button>See what we have to offer</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
