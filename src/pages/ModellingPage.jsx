import React, { Component } from "react";
import { DataSet } from "vis";
import ModellingForm from "../components/ModellingForm";
import ModellingView from "../components/ModellingView";

class ModellingPage extends Component {
  state = {
    tasks: -1,
    cs: -1,
    queue: -1,
    connectionType: 2,
    assignmentAlgo: -1
  };

  getGraphs = type => {
    let graphs = localStorage.getItem(type);
    if (!graphs) return;
    graphs = JSON.parse(graphs);
    return graphs;
  };

  getById = (graphs, id) => {
    const found = graphs.filter(graph => graph.id === id);
    return found[0];
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleChangeGraph = e => {
    this.setState({
      [e.target.name]: e.target.value,
      [`${e.target.name}Data`]: this.getById(
        this.getGraphs(e.target.name),
        e.target.value
      ).data
    });
  };

  render() {
    const {
      tasks,
      queue,
      cs,
      assignmentAlgo,
      tasksData,
      csData,
      connectionType
    } = this.state;
    return (
      <React.Fragment>
        <ModellingForm
          handleChange={this.handleChange}
          handleChangeGraph={this.handleChangeGraph}
          tasks={tasks}
          cs={cs}
          queue={queue}
          connectionType={connectionType}
          assignmentAlgo={assignmentAlgo}
          getGraphs={this.getGraphs}
          tasksData={tasksData}
          csData={csData}
        />
        <hr />
        {!(
          tasks === -1 ||
          cs === -1 ||
          queue === -1 ||
          assignmentAlgo === -1 ||
          connectionType === -1
        ) && (
          <ModellingView
            tasks={{
              nodes: new DataSet(tasksData.nodes),
              edges: new DataSet(tasksData.edges)
            }}
            cs={{
              nodes: new DataSet(csData.nodes),
              edges: new DataSet(csData.edges)
            }}
            queue={queue}
            connectionType={connectionType}
            assignmentAlgo={assignmentAlgo}
          />
        )}
      </React.Fragment>
    );
  }
}

export default ModellingPage;
