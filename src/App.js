import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faIgloo } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./containers/Navbar";
import Routes from "./containers/Routes";
import "bootstrap/dist/css/bootstrap.min.css";

library.add(faIgloo);

class App extends Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <React.Fragment>
          <Navbar />
          <Routes />
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
