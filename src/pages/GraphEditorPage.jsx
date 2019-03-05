import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { DataSet } from "vis";
import GraphView from "../components/GraphView";
import Message from "../components/Message";

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
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    const { history, id, name } = this.props;
    e.preventDefault();
    this.graphToMatrix();
    if (name !== "cs" && this.isCyclic()) {
      this.setState({ error: "Циклічний граф!" });
      return;
    }
    if (name !== "tasks" && this.isConnected()) {
      this.setState({ error: "Граф незв'язний!" });
      return;
    }
    let { nodes, edges } = this.state.data;
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

  isConnected() {
    const { nodes, edges } = this.state.data;
    const connectedNodes = {};
    const graph = {};
    nodes.forEach(node => {
      connectedNodes[node.id] = [];
    });
    edges.forEach(edge => {
      connectedNodes[edge.from].push(edge.to);
      connectedNodes[edge.to].push(edge.from);
    });
    for (var id in connectedNodes) {
      if (!graph[id]) graph[id] = {};
      // eslint-disable-next-line
      connectedNodes[id].forEach(function(aid) {
        graph[id][aid] = 1;
        if (!graph[aid]) graph[aid] = {};
        graph[aid][id] = 1;
      });
    }
    let found = false;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes.get(i);
      if (!node) continue;
      const paths = this.isConnectedUtil(node.id, graph);
      if (Object.keys(paths).length !== Object.keys(graph).length) {
        found = true;
        break;
      }
    }
    return found;
  }

  isConnectedUtil(s, graph) {
    const solutions = {};
    solutions[s] = [];
    solutions[s].dist = 0;

    while (true) {
      let parent = null;
      let nearest = null;
      let dist = Infinity;
      for (let n in solutions) {
        if (!solutions[n]) continue;
        const ndist = solutions[n].dist;
        const adj = graph[n];
        for (let a in adj) {
          if (solutions[a]) continue;
          const d = adj[a] + ndist;
          if (d < dist) {
            parent = solutions[n];
            nearest = a;
            dist = d;
          }
        }
      }

      if (dist === Infinity) {
        break;
      }

      solutions[nearest] = parent.concat(nearest);
      solutions[nearest].dist = dist;
    }

    return solutions;
  }

  graphToMatrix() {
    let { nodes, edges } = this.state.data;
    this.matrix = {};
    nodes.forEach(node => {
      this.matrix[node.id] = [];
    });
    edges.forEach(edge => {
      this.matrix[edge.from].push(edge.to);
    });
  }

  isCyclic() {
    debugger;
    const graphNodes = Object.keys(this.matrix);
    const visited = {};
    const recStack = {};

    for (let i = 0; i < graphNodes.length; i++) {
      const node = graphNodes[i];
      const cycleCheck = this.cyclicUtil(node, visited, recStack);
      if (cycleCheck !== -1) return { from: parseInt(node), to: cycleCheck };
    }
    return false;
  }

  cyclicUtil(index, visited, recStack) {
    if (!visited[index]) {
      visited[index] = true;
      recStack[index] = true;
      const nodeNeighbors = this.matrix[index];
      for (let i = 0; i < nodeNeighbors.length; i++) {
        const currentNode = nodeNeighbors[i];
        if (
          !visited[currentNode] &&
          this.cyclicUtil(currentNode, visited, recStack) !== -1
        )
          return currentNode;
        else if (recStack[currentNode]) return currentNode;
      }
    }
    recStack[index] = false;
    return -1;
  }

  handleGenerate = (e, formData) => {
    e.preventDefault();
    const { vertexNumb, maxWeight, minWeight, correlation } = formData;
    this.generate(vertexNumb, maxWeight, minWeight, correlation);
  };

  generate = (vertexNumb, maxWeight, minWeight, correlation) => {
    const { edges, nodes } = this.state.data;
    const newNodes = [];
    for (let i = 0; i < vertexNumb; i++) {
      const weight = this._getRandomInt(minWeight, maxWeight);
      newNodes.push({
        id: i,
        number: i,
        weight,
        label: `${i}\n—\n${weight}`,
        x: this._getRandomInt(-500, 500),
        y: this._getRandomInt(-500, 500)
      });
    }
    const weights = newNodes.reduce((sum, node) => (sum += node.weight), 0);
    const lengths = Math.round((weights * (1 - correlation)) / correlation);
    const matrix = [];
    const arr = [];
    for (let i = 0; i < vertexNumb; i++) arr.push(0);
    for (let i = 0; i < vertexNumb; i++) matrix.push(arr.slice());
    let cur_l_w = 0;
    while (cur_l_w < lengths) {
      let number1 = this._getRandomInt(0, vertexNumb - 1);
      let number2 = this._getRandomInt(0, vertexNumb - 1);
      if (number1 === number2) number2 = number1 + 1;
      if (matrix[number2][number1] > 0) {
        const tmp = number1;
        number1 = number2;
        number2 = tmp;
      }
      matrix[number1][number2] += 1;
      cur_l_w += 1;
    }
    const newEdges = [];
    matrix.forEach((arr, i) => {
      arr.forEach((value, j) => {
        if (value > 0)
          newEdges.push({ from: i, to: j, weight: value, label: `${value}` });
      });
    });
    nodes.clear();
    edges.clear();
    nodes.add(newNodes);
    edges.add(newEdges);
    this.graphToMatrix();
    let cycle = this.isCyclic();
    while (cycle) {
      // eslint-disable-next-line
      edges.forEach(edge => {
        console.log(
          `${JSON.stringify(edge)}, cycle: ${JSON.stringify(
            cycle
          )} ${edge.from === cycle.from && edge.to === cycle.to}`
        );
        if (edge.from === cycle.from && edge.to === cycle.to) {
          const weight = edge.weight;
          edges.remove(edge.id);
          const ids = edges.getIds();
          const randomEdgeId = ids[this._getRandomInt(0, ids.length)];
          console.log(edges.get(randomEdgeId));
          const randowEdge = edges.get(randomEdgeId);
          edges.update({
            id: randomEdgeId,
            weight: randowEdge.weight + weight,
            label: `${randowEdge.weight + weight}`
          });
          console.log(edges.get(randomEdgeId));
          this.graphToMatrix();
          cycle = this.isCyclic();
          return;
        }
      });
    }
    this.setState({
      generated: true,
      nodesWeightSum: weights,
      edgesWeightSum: cur_l_w
    });
  };

  _getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  render() {
    const {
      graphName,
      data,
      error,
      edgesWeightSum,
      nodesWeightSum,
      generated
    } = this.state;
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
            <input
              type="submit"
              onClick={this.handleSubmit}
              className="btn btn-primary float-right"
              value="Зберегти"
            />
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(GraphEditorPage);
