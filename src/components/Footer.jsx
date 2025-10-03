import React from "react";
import Container from "react-bootstrap/Container";

const Footer = () => {
  return (
    <footer className="mt-auto py-5 text-center" style={{ backgroundColor: "#f5f5f5" }}>
      <Container>
        <small>
          © {new Date().getFullYear()} Ahmed Shleibik ·{" "}
          <a href="https://github.com/ashleibik" target="_blank" rel="noopener noreferrer">GitHub</a> ·{" "}
          <a
            href="https://mail.google.com/mail/?view=cm&to=ashleibik@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Email
          </a>
        </small>
      </Container>
    </footer>
  );
};

export default Footer;
