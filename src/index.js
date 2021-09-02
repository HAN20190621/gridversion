import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";

// import App from "./components/Line";
// import App from "./App";
import App from "./components/Grid";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
