import { Network } from "vis";
import React, { Component, createRef } from "react";
import "vis/dist/vis.css";

const TYPE_CS = 1;
const TYPE_TASK = 2;

class GraphView extends Component {
  constructor(props) {
    super(props);
    this.type = props.name === "tasks" ? TYPE_TASK : TYPE_CS;
    this.network = {};
    this.appRef = createRef();
    this.options = {
      locales: this.locales,
      locale: "uk",
      physics: {
        enabled: false
      },
      manipulation: {
        enabled:
          this.props.manipulationActive !== undefined
            ? this.props.manipulationActive
            : true,
        initiallyActive: true,
        addNode: (data, callback) => {
          this.params(data, callback, "add", "вершини");
        },
        // editNode: (data, callback) => {
        //   this.params(data, callback, "edit", "вершини");
        // },
        addEdge: (data, callback) => {
          this.params(data, callback, "add", "зв'язку");
        }
        // editEdge: (data, callback) => {
        //   this.params(data, callback, "edit", "зв'язку");
        // }
      },
      edges: {
        arrows: {
          to: {
            enabled: this.type === TYPE_TASK
          }
        }
      }
    };
    this.state = {
      data: props.data,
      type: this.type,
      manipulationActive:
        this.props.manipulationActive !== undefined
          ? this.props.manipulationActive
          : true
    };
  }

  locales = {
    uk: {
      edit: "Редагувати",
      del: "Видалити обране",
      back: "Назад",
      addNode: "Додати вершину",
      addEdge: "Додати зв'язок",
      editNode: "Редагувати вершину",
      editEdge: "Редагувати зв'язок",
      addDescription: "Натисніть на пустому місці аби додати вершину.",
      edgeDescription:
        "Аби з'єднати вершини клікніть по початковій вершині та по кінцевій.",
      editEdgeDescription:
        "Click on the control points and drag them to a node to connect to it.",
      createEdgeError: "Cannot link edges to a cluster.",
      deleteClusterError: "Clusters cannot be deleted.",
      editClusterError: "Clusters cannot be edited."
    }
  };

  params = (data, callback, mode, type) => {
    const isEdit = mode === "edit";
    const isEdge = type === "зв'язку";
    const { nodes } = this.state.data;
    const lastId = nodes.map(node => node.id).sort((a, b) => b - a)[0];
    const number = isEdit ? data.number : !isNaN(lastId) ? lastId + 1 : 0;
    const weight = this.getWeight(type, isEdit, data);
    if (!weight) return;
    const label = `${
      !isEdge
        ? this.state.type === TYPE_CS
          ? `${number}`
          : `${number}\n — \n${weight}`
        : this.state.type === TYPE_CS
        ? ``
        : `${weight}`
    }`;
    data.number = number;
    data.weight = weight;
    data.label = label;
    if (!isEdit && !isEdge) {
      data.id = number;
    }
    try {
      return callback(data);
    } catch (e) {
      console.log(e);
    }
  };

  getWeight(type, isEdit, data) {
    if (this.state.type === TYPE_CS) return ` `;
    let weight = prompt(`Вага ${type}`, isEdit ? data.weight : ``);
    if (!weight) return alert(`"Вагу ${type} не задано!"`);
    weight = parseInt(weight);
    if (isNaN(weight)) return alert(`Невірний формат ваги ${type}!`);
    if (weight <= 0)
      return alert(`Вага не може бути негативною чи дорівнювати 0`);
    return weight;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // console.log(`PrevProps: ${JSON.stringify(prevProps)}`);
    // console.log(`NewProps: ${JSON.stringify(this.props)}`);
    return prevProps.data !== this.props.data;
    // const { edges, nodes } = this.props.data;
    // const { edges: edgesP, nodes: nodesP } = prevProps.data;
    // if (!edgesP || !nodesP) return false;
    // return edges.length !== edgesP.length || nodes.length !== nodesP.length;
  }

  onDoubleClick = params => {
    const { nodes, edges } = params;
    const {
      data: { nodes: nodesS, edges: edgesS },
      type
    } = this.state;
    if (type === TYPE_CS) return;
    if (nodes.length > 0) {
      const node = nodesS.get(nodes[0]);
      const weight = this.getWeight("вершини", true, { weight: node.weight });
      if (!weight) return;
      const label = `${node.id}\n—\n${weight}`;
      nodesS.update({ ...node, weight, label });
    } else {
      const edge = edgesS.get(edges[0]);
      const weight = this.getWeight("зв'язку", true, { weight: edge.weight });
      if (!weight) return;
      const label = `${weight}`;
      edgesS.update({ ...edge, weight, label });
    }
  };

  componentDidMount() {
    this.network = new Network(
      this.appRef.current,
      this.props.data,
      this.options
    );
    if (this.state.type === TYPE_TASK && this.state.manipulationActive)
      this.network.on("doubleClick", params => this.onDoubleClick(params));
    this.setState({
      data: {
        nodes: this.network.body.data.nodes,
        edges: this.network.body.data.edges
      }
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!snapshot) return;
    this.network = new Network(
      this.appRef.current,
      this.props.data,
      this.options
    );
    if (this.state.type === TYPE_TASK && this.state.manipulationActive)
      this.network.on("doubleClick", params => this.onDoubleClick(params));
    this.setState({
      data: {
        nodes: this.network.body.data.nodes,
        edges: this.network.body.data.edges
      }
    });
  }

  render() {
    const { height, width } = this.props;
    return (
      <div
        className="my-3"
        style={{
          height: height ? height : "600px",
          width: width ? width : "100%"
        }}
        ref={this.appRef}
      />
    );
  }
}

export default GraphView;
