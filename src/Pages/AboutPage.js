// AboutPage.js
import React from 'react';

function AboutPage() {
    return (
        <div className="content">
            <div className="content-box">

          <h1 className="title">About Us</h1>
    
          <section className="story">
            <h2 className="section-title">Our Story</h2>
            <p className="paragraph">
              At BetterEarthToday, we believe in raising awareness about environmental issues.
              We are passionate about saving and preserving our earth and committed to gathering support for our cause.
            </p>
          </section>
    
          <section className="team">
            <h2 className="section-title">Our Team</h2>
            <p className="paragraph">
              Behind BetterEarthToday, there's a dedicated team of professionals who bring their unique skills and expertise to the table.
            </p>
    
            {/* Team members can be mapped from an array */}
            <div className="team-member">
              <h3 className="team-member-name">Vishwa Kamalbabu</h3>
              <p className="team-member-description">
                Vishwa is the visionary behind BetterEarthToday. He is a high school senior at Carmel High School, with previous experiences in coding webpages. Vishwa believes in cleaning up our earth and keeping it habitable for the future generations to come.
            </p>
            </div>
    
            {/* Add more team members here */}
          </section>
    
          {/* Other sections like Values, Mission, Why Choose Us, etc. */}
          </div>
        </div>
      );
}

export default AboutPage;

