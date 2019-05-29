import React, { Component } from "react";
import Queue from "../models/Queue";
import Model from "../models/Model";
import "react-vis/dist/style.css";
import Stats from "../models/Stats";
import ModellingResult from "./ModellingResult";

class ModellingView extends Component {
  state = {};

  render() {
    console.clear();
    const {
      tasks,
      cs,
      queue: method,
      assignmentAlgo,
      connectionType
    } = this.props;
    const queue = new Queue(parseInt(method), tasks);
    const queueResult = queue.run();
    const { result: resultMulti, tasks: tasksWeights } = new Model(
      tasks,
      cs,
      queueResult,
      assignmentAlgo,
      connectionType
    ).model();
    const { stats, info } = new Stats(
      resultMulti,
      queue,
      tasksWeights,
      cs.nodes.length
    ).getStats();
    if (!resultMulti) return <div />;
    return (
      <React.Fragment>
        <h5 className="h5">Черга задач:</h5>
        <div>
          {Object.values(queueResult)
            .map(val => val.number)
            .join(", ")}
        </div>
        <ModellingResult resultMulti={resultMulti} cs={cs} />
        <hr />
        <h6 className="h6">Статистичні дані:</h6>
        <ul>
          {Object.keys(info).map((key, i) => (
            <p key={i}>
              <li>
                {info[key].title}: <b>{info[key].value}</b>
              </li>
            </p>
          ))}
        </ul>
        <hr />
        <h6 className="h6">Коефіцієнти:</h6>
        <ol>
          {Object.keys(stats).map((key, i) => (
            <p key={i}>
              <li>
                {stats[key].title}: <b>{stats[key].value}</b>
              </li>
            </p>
          ))}
        </ol>
      </React.Fragment>
    );
  }
}

export default ModellingView;
