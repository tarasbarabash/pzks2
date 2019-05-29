import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="jumbotron">
      <div>
        <h4 className="h4">Програмне забезпечення комп'ютерних систем-2</h4>
        <hr />
        <p className="lead">
          <b>Виконав:</b>
          <br /> студент групи ІО-82мп <br /> Барабаш Т.А.
        </p>
        <div className="text-right">
          <Link to="/model" className="btn btn-primary">
            Почати роботу
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
