import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import GraphList from "../components/GraphList";

const ID = () =>
  "_" +
  Math.random()
    .toString(36)
    .substr(2, 9);

class HomePage extends Component {
  state = {};

  componentDidMount() {
    if (!this.props.name) return;
    const graphs = localStorage.getItem(this.props.name);
    if (!graphs) return this.setState({ graphs: [] });
    this.setState({ graphs: JSON.parse(graphs) });
  }

  handleDelete = id => {
    const deleteConfirmation = window.confirm("Дійсно бажаєте видалити граф?");
    if (!deleteConfirmation) return;
    let graphs = this._getGraphs();
    graphs = graphs.filter(item => item.id !== id);
    localStorage.setItem(this.props.name, JSON.stringify(graphs));
    this.setState({ graphs });
  };

  handleClone = id => {
    let graphs = this._getGraphs();
    const graph = { ...graphs.filter(graph => graph.id === id)[0] };
    graph.name = `${graph.name} - копія`;
    graph.id = ID();
    const date = new Date();
    graph.created = date;
    graph.updated = date;
    graphs = [...graphs, graph];
    localStorage.setItem(this.props.name, JSON.stringify(graphs));
    this.setState({ graphs });
  };

  handleDeleteAll = () => {
    const deleteConf = window.confirm("Ви справді бажаєте видалити всі графи?");
    if (deleteConf) {
      localStorage.setItem(this.props.name, []);
      this.setState({ graphs: localStorage.getItem(this.props.name) });
    }
  };

  handleNew = () => {
    this.setState({ view: { showModal: true } });
  };

  _getGraphs = () => {
    let graphs = localStorage.getItem(this.props.name);
    if (!graphs) return;
    graphs = JSON.parse(graphs);
    return graphs;
  };

  render() {
    const { graphs } = this.state;
    const { name } = this.props;
    return (
      <React.Fragment>
        <h4 className="my-4">
          {this.props.title}
          <div className="float-right btn-group">
            <Link to={`/${name}/new`} className="btn btn-primary">
              <FontAwesomeIcon icon={faPlus} />
            </Link>
            <button className="btn btn-danger" onClick={this.handleDeleteAll}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        </h4>
        <GraphList
          name={name}
          list={graphs}
          onDelete={this.handleDelete}
          onClone={this.handleClone}
        />
      </React.Fragment>
    );
  }
}

export default HomePage;
