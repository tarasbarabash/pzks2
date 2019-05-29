import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { DataSet } from "vis";
import GraphView from "../components/GraphView";
import Message from "../components/Message";
import GenerationForm from "../components/GenerationForm";
import Generator from "../models/Generator";
import { isCyclic, isConnected } from "../models/GraphTools";

const ID = () =>
  "_" +
  Math.random()
    .toString(36)
    .substr(2, 9);

class GraphEditorPage extends Component {
  state = {
    graphName: "",
    data: {
      edges: new DataSet(),
      nodes: new DataSet()
    }
  };

  constructor(props) {
    super(props);
    this.errorRef = React.createRef();
    this.graphRef = React.createRef();
  }

  componentDidMount() {
    const { id, name } = this.props;
    if (!id) return;
    let graphs = localStorage.getItem(`${name}`);
    if (!graphs) return;
    graphs = JSON.parse(graphs);
    const graph = graphs.filter(item => item.id === id)[0];
    const { edges, nodes } = graph.data;
    const data = { edges: new DataSet(edges), nodes: new DataSet(nodes) };
    this.setState({ graphName: graph.name, data });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.error) {
      window.scrollTo(0, this.errorRef.current.offsetTop);
    }
    if (this.state.generated) {
      window.scrollTo(0, this.graphRef.current.offsetTop);
    }
  }

  handleChange = e => {
    if (e.target.name === "showJson") {
      this.setState({
        [e.target.name]: this.state.showJson ? !this.state.showJson : true
      });
      return;
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    const { history, id, name } = this.props;
    let { nodes, edges } = this.state.data;
    e.preventDefault();
    if (name !== "cs" && isCyclic(nodes, edges)) {
      this.setState({ error: "Циклічний граф!" });
      return;
    }
    if (name !== "tasks" && isConnected(nodes, edges)) {
      this.setState({ error: "Граф незв'язний!" });
      return;
    }
    nodes = nodes._data ? Object.values(nodes._data) : [];
    edges = edges._data ? Object.values(edges._data) : [];
    const data = { nodes, edges };
    const { graphName } = this.state;
    let graphs = localStorage.getItem(`${name}`);
    graphs = !graphs ? [] : JSON.parse(graphs);
    let oldTask = {};
    if (id) oldTask = graphs.filter(item => item.id === id)[0];
    const task = {
      name: graphName ? graphName : `Без імені ${graphs.length}`,
      data: data,
      id: id ? oldTask.id : ID(),
      created: id ? oldTask.created : new Date(),
      updated: new Date()
    };
    if (id) graphs = [...graphs.filter(item => item.id !== id), task];
    else graphs.push(task);
    localStorage.setItem(`${name}`, JSON.stringify(graphs));
    const urlParams = new URLSearchParams(window.location.search);
    const next = urlParams.has("next") ? urlParams.get("next") : null;
    console.log(next);
    history.push(`${next ? next : `/${name}`}`);
  };

  handleGenerate = (e, formData) => {
    e.preventDefault();
    const { vertexNumb, maxWeight, minWeight, correlation } = formData;
    const { edges, nodes, weights, cur_l_w } = new Generator(
      vertexNumb,
      maxWeight,
      minWeight,
      correlation
    ).generate();

    this.setState({
      generated: true,
      data: { nodes: nodes, edges: edges },
      nodesWeightSum: weights,
      edgesWeightSum: cur_l_w
    });
  };

  render() {
    const {
      graphName,
      data,
      error,
      edgesWeightSum,
      nodesWeightSum,
      generated,
      showJson
    } = this.state;
    const { name, id } = this.props;
    return (
      <React.Fragment>
        <div className="my-4">
          <h4 className="my-4">Редактор графу</h4>
          <form>
            <div className="form-group" ref={this.errorRef}>
              <input
                name="graphName"
                autoComplete="off"
                required
                value={graphName}
                onChange={this.handleChange}
                className="form-control"
                placeholder="Назва графу"
              />
            </div>
            {error && <Message type="error" message={error} />}
            <GraphView data={data} name={this.props.name} ref={this.graphRef} />
            {generated && (
              <div>{`Сумарна вага вершин графу: ${nodesWeightSum}, cумарна вага дуг графу: ${edgesWeightSum}`}</div>
            )}
            {id && (
              <div className="form-group">
                <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={this.handleChange}
                  id="json"
                  name="showJson"
                />
                {
                  <label className="form-check-label" htmlFor="json">
                    Показати JSON
                  </label>
                }
              </div>
            )}
            {showJson && (
              <textarea className="form-control" disabled rows="3">
                {JSON.stringify(
                  JSON.parse(localStorage.getItem(name)).filter(
                    i => i.id === id
                  )[0]
                )}
              </textarea>
            )}
            <div className="text-right">
              <input
                type="submit"
                onClick={this.handleSubmit}
                className="btn btn-primary"
                value="Зберегти"
              />
            </div>
          </form>
        </div>

        {name === "tasks" && !id && (
          <GenerationForm
            showTitle={true}
            showButton={true}
            onGenerate={(e, formData) => this.handleGenerate(e, formData)}
          />
        )}
      </React.Fragment>
    );
  }
}
export default withRouter(GraphEditorPage);
