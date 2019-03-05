import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="jumbotron">
      <h4 className="h4">Програмне забезпечення комп'ютерних систем-2</h4>
      <hr />
      <p className="lead">
        <b>Виконав:</b>
        <br /> студент групи ІО-82мп <br /> Барабаш Т.А.
      </p>
      <Link to="/tasks" className="btn btn-primary float-right">
        Почати роботу
      </Link>
    </div>
  );
};

export default HomePage;
