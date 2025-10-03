import React from "react";
import { getInTouch } from "../../editable-stuff/config";

const GetInTouchSection = () => {
  if (!getInTouch.show) return null;

  const { heading, message, email } = getInTouch;
  const gmailHref = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}`;

  return (
    <section id="contact" className="py-5">
      <div className="container text-center">
        <h2 className="mb-3">{heading}</h2>
        <p className="lead">
          {message}{" "}
          <a href={gmailHref} target="_blank" rel="noopener noreferrer">
            {email}
          </a>
        </p>
      </div>
    </section>
  );
};

export default GetInTouchSection;
