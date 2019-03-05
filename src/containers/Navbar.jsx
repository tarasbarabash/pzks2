import React from "react";
import { NavLink } from "react-router-dom";
import "jquery/dist/jquery";
import "popper.js/dist/popper";
import "bootstrap/dist/js/bootstrap";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <NavLink className="navbar-brand" to="/">
        ПЗКС-2
      </NavLink>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink className="nav-link" activeClassName="active" to="/tasks">
              Граф задач <span className="sr-only">(current)</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" activeClassName="active" to="/cs">
              Граф комп'ютерної системи
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              exact
              className="nav-link disabled"
              activeClassName="active"
              to="/model"
            >
              Моделювання
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              exact
              className="nav-link disabled"
              activeClassName="active"
              to="/stats"
            >
              Статистика
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
