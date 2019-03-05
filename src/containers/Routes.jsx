import React from "react";
import { Switch, Route } from "react-router-dom";
import { GraphEditorPage, GraphListPage, HomePage } from "../pages";

const Routes = () => {
  return (
    <div className="container my-4">
      <Switch>
        <Route
          exact
          key="home-page"
          path="/"
          render={() => {
            document.title = `ПЗКС - 2`;
            return <HomePage />;
          }}
        />
        <Route
          key="tasks-graphs"
          exact
          path="/tasks"
          render={() => {
            document.title = `Графи задач | ПЗКС - 2`;
            return <GraphListPage name="tasks" title="Графи задач" />;
          }}
        />
        <Route
          exact
          path="/tasks/new"
          render={() => {
            document.title = `Новий граф задач | ПЗКС - 2`;
            return <GraphEditorPage name="tasks" />;
          }}
        />
        <Route
          path="/tasks/:id"
          exact
          type="task"
          render={props => {
            document.title = `Редактор графу задач | ПЗКС - 2`;
            return <GraphEditorPage name="tasks" id={props.match.params.id} />;
          }}
        />
        <Route
          key="cs-graphs"
          exact
          path="/cs"
          render={() => {
            document.title = `Графи комп'ютерних систем | ПЗКС - 2`;
            return (
              <GraphListPage name="cs" title="Графи комп'ютерної системи" />
            );
          }}
        />
        <Route
          exact
          path="/cs/new"
          render={() => {
            document.title = `Новий граф комп'ютерної системи | ПЗКС - 2`;
            return <GraphEditorPage name="cs" />;
          }}
        />
        <Route
          path="/cs/:id"
          type="task"
          render={props => {
            document.title = `Редактор графу комп'ютерної системи | ПЗКС - 2`;
            return <GraphEditorPage name="cs" id={props.match.params.id} />;
          }}
        />
        />
      </Switch>
    </div>
  );
};

export default Routes;
