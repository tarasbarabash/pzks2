import React, { Component } from "react";
import GraphView from "../components/GraphView";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen } from "@fortawesome/free-solid-svg-icons";

class ModellingForm extends Component {
  state = {};

  constructor() {
    super();
    this.csGraphRef = React.createRef();
    this.tasksGraphRef = React.createRef();
  }

  renderGraphList(type) {
    const graphs = this.props.getGraphs(type);
    if (!graphs) return <option disabled>Відсутні графи</option>;
    return graphs.map(graph => (
      <option key={graph.id} value={graph.id}>
        {graph.name}
      </option>
    ));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <div className="form-row p-2">
            <div className="col-md">
              <div>
                <label className="h6" htmlFor="tasks">
                  Граф задач:
                </label>
                <div className="float-right">
                  <Link
                    className="badge badge-light"
                    to="/tasks/new?next=/model"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Link>
                  {this.props.tasks !== -1 && (
                    <Link
                      to={`/tasks/${this.props.tasks}?next=/model`}
                      className="badge badge-light"
                      alt="Редагувати обраний граф"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </Link>
                  )}
                </div>
              </div>
              <select
                name="tasks"
                id="tasks"
                value={this.props.tasks}
                className="form-control"
                onChange={this.props.handleChangeGraph}
              >
                <option value="-1" disabled>
                  Оберіть граф задач
                </option>
                {this.renderGraphList("tasks")}
              </select>
              {this.props.tasks !== -1 && (
                <GraphView
                  manipulationActive={false}
                  height="300px"
                  name="tasks"
                  data={this.props.tasksData}
                  ref={this.tasksGraphRef}
                />
              )}
            </div>
            <div className="col-md">
              <label className="h6" htmlFor="cs">
                Граф комп'ютерної системи:
              </label>
              <div className="float-right">
                <Link to="/cs/new?next=/model" className="badge badge-light">
                  <FontAwesomeIcon icon={faPlus} />
                </Link>
                {this.props.cs !== -1 && (
                  <Link
                    to={`/cs/${this.props.cs}?next=/model`}
                    className="badge badge-light"
                    alt="Редагувати обраний граф"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </Link>
                )}
              </div>
              <select
                value={this.props.cs}
                name="cs"
                id="cs"
                className="form-control"
                onChange={this.props.handleChangeGraph}
              >
                <option value="-1" disabled>
                  Оберіть граф комп'ютерної системи
                </option>
                {this.renderGraphList("cs")}
              </select>
              {this.props.cs !== -1 && (
                <GraphView
                  height="300px"
                  manipulationActive={false}
                  name="cs"
                  data={this.props.csData}
                  ref={this.csGraphRef}
                />
              )}
            </div>
          </div>
          <div className="form-row p-2">
            <div className="col-md">
              <div className="form-group">
                <label className="h6" htmlFor="queue">
                  Алгоритм формування черги задач:
                </label>
                <select
                  name="queue"
                  id="queue"
                  value={this.props.queue}
                  className="form-control"
                  onChange={this.props.handleChange}
                >
                  <option value="-1" disabled>
                    Оберіть чергу
                  </option>
                  <option
                    value="1"
                    title="У порядку спадання пронормованої суми критичних по часу і
                  по кількості вершин шляхів до кінця графа задачі"
                  >
                    1
                  </option>
                  <option
                    value="11"
                    title="У порядку спадання зв’язності вершин, а при рівних
                  значеннях – в порядку зростання критичного по часу шляхів від
                  початку графа задачі."
                  >
                    11
                  </option>
                </select>
              </div>
            </div>
            <div className="col-md">
              <div className="form-group">
                <label className="h6" htmlFor="assignmentAlgo">
                  Алгоритм призначення:
                </label>
                <select
                  name="assignmentAlgo"
                  id="assignmentAlgo"
                  value={this.props.assignmentAlgo}
                  className="form-control"
                  onChange={this.props.handleChange}
                >
                  <option value="-1" disabled>
                    Оберіть алгоритм
                  </option>
                  <option
                    value="2"
                    title="Призначення на перший процесор,що звільнився. У цьому
                  випадку, при призначенні, з вільних процесорів вибирається
                  той, який звільнився і простоює довше за інших."
                  >
                    2
                  </option>
                  <option
                    value="6"
                    title="Алгоритм «сусіднього» призначення з використанням
                  моделювання для визначення початкового часу виконання
                  обчислювальних робіт."
                  >
                    6
                  </option>
                </select>
              </div>
            </div>
            {/* <div className="col-md">
              <div className="form-group">
                <label className="h6" htmlFor="connectionType">
                  Тип з'єднання:
                </label>
                <select
                  name="connectionType"
                  id="connectionType"
                  value={this.props.connectionType}
                  className="form-control"
                  onChange={this.props.handleChange}
                >
                  <option value="-1" disabled>
                    Оберіть тип з'єднання
                  </option>
                  <option value="1">Дуплексне</option>
                  <option value="2">Напівдуплексне</option>
                </select>
              </div>
            </div> */}
          </div>
        </div>
      </form>
    );
  }
}

export default ModellingForm;
