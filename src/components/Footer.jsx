import React from "react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  let location = useLocation();
  return (
    <>
      {location.pathname === "/" && (
        <footer style={{ textAlign: "center" }}>
          <p>Copyright &copy; {new Date().getFullYear()}</p>
          <Link to="/About">About</Link>
          {/* <a href="/About">About</a> */}
        </footer>
      )}
    </>
  );
};

export default Footer;
