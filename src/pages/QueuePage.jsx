import React, { Component } from "react";
import { DataSet } from "vis";
import { Link } from "react-router-dom";
import GraphView from "../components/GraphView";
import QueueView from "../components/QueueView";

class QueuePage extends Component {
  state = {};

  constructor(props) {
    super(props);
    const id = props.id;
    let graphs = localStorage.getItem("tasks");
    if (!graphs) return;
    graphs = JSON.parse(graphs);
    const graph = graphs.filter(item => item.id === id)[0];
    const { edges, nodes } = graph.data;
    const data = { edges: new DataSet(edges), nodes: new DataSet(nodes) };
    this.state.data = data;
  }

  render() {
    const { data } = this.state;
    const { id } = this.props;
    return (
      <React.Fragment>
        <h4>
          Формування черги задач
          <div className="float-right btn-group">
            <Link
              to={`/tasks/${id}?next=${window.location.pathname}`}
              className="btn btn-primary"
            >
              Редагувати граф
            </Link>
          </div>
        </h4>
        <GraphView name="tasks" data={data} manipulationActive={false} />
        <QueueView data={data} />
      </React.Fragment>
    );
  }
}

export default QueuePage;
