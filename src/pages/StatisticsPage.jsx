import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Model from "../models/Model";
import Queue from "../models/Queue";
import Generator from "../models/Generator";
import GraphView from "../components/GraphView";
import Stats from "../models/Stats";
import ModellingResult from "../components/ModellingResult";

class StatisticsPage extends Component {
  queues = [1, 11];
  models = ["2", "6"];
  state = {
    startCorrelation: 0.5,
    endCorrelation: 0.9,
    stepCorrelation: 5,
    minVertexNumb: -1,
    stepVertexNumb: 10,
    maxWeight: 10,
    minWeight: 1,
    graphCount: 2,
    cs: -1
  };

  constructor(props) {
    super(props);
    this.csGraphRef = React.createRef();
    this.tasksGraphRef = React.createRef();
  }

  getGraphs = type => {
    let graphs = localStorage.getItem(type);
    if (!graphs) return;
    graphs = JSON.parse(graphs);
    return graphs;
  };

  renderGraphList(type) {
    const graphs = this.getGraphs(type);
    if (!graphs) return <option disabled>Відсутні графи</option>;
    return graphs.map(graph => (
      <option key={graph.id} value={graph.id}>
        {graph.name}
      </option>
    ));
  }

  getById = (graphs, id) => {
    const found = graphs.filter(graph => graph.id === id);
    return found[0];
  };

  handleChangeGraph = e => {
    const data = this.getById(this.getGraphs(e.target.name), e.target.value)
      .data;
    this.setState({
      [e.target.name]: e.target.value,
      [`${e.target.name}Data`]: data,
      minVertexNumb: data.nodes.length,
      stepVertexNumb: data.nodes.length
    });
  };

  handleChange(e) {
    this.setState({ [e.target.name]: parseFloat(e.target.value) });
  }

  render() {
    const {
      openedGraph,
      openedModel,
      graphCount,
      result,
      startCorrelation,
      endCorrelation,
      stepCorrelation,
      minWeight,
      maxWeight,
      minVertexNumb,
      stepVertexNumb
    } = this.state;
    return (
      <React.Fragment>
        <form className="my-2">
          <h5>Параметри генерації таблиці</h5>
          <div className="input-group mb-2">
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text">
                  Граф комп'ютерної системи:
                </div>
              </div>
              <select
                value={this.state.cs}
                name="cs"
                id="cs"
                className="form-control"
                onChange={this.handleChangeGraph}
              >
                <option value="-1" disabled>
                  Оберіть граф комп'ютерної системи
                </option>
                {this.renderGraphList("cs")}
              </select>
              <GraphView
                height="300px"
                manipulationActive={false}
                name="cs"
                data={this.state.csData}
                ref={this.csGraphRef}
              />
            </div>
            <div className="input-group-prepend">
              <div className="input-group-text">Початкова зв'язність:</div>
            </div>
            <input
              type="number"
              className="form-control"
              autoComplete="off"
              step="0.05"
              max="1"
              min="0"
              name="startCorrelation"
              value={startCorrelation}
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div className="input-group mb-2">
            <div className="input-group-prepend">
              <div className="input-group-text">Кінцева зв'язність:</div>
            </div>
            <input
              type="number"
              className="form-control"
              autoComplete="off"
              step="0.05"
              max="1"
              min={startCorrelation}
              name="endCorrelation"
              value={endCorrelation}
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div className="input-group mb-2">
            <div className="input-group-prepend">
              <div className="input-group-text">
                Кількість кроків зміни зв'язності:
              </div>
            </div>
            <input
              type="number"
              className="form-control"
              autoComplete="off"
              name="stepCorrelation"
              value={stepCorrelation}
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div className="input-group mb-2">
            <div className="input-group-prepend">
              <div className="input-group-text">Початкова к-сть вершин:</div>
            </div>
            <input
              type="number"
              className="form-control"
              autoComplete="off"
              name="minVertexNumb"
              value={minVertexNumb}
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div className="input-group mb-2">
            <div className="input-group-prepend">
              <div className="input-group-text">
                Крок нарощення к-сті вершин:
              </div>
            </div>
            <input
              type="number"
              className="form-control"
              autoComplete="off"
              name="stepVertexNumb"
              value={stepVertexNumb}
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div className="input-group mb-2">
            <div className="input-group-prepend">
              <div className="input-group-text">Мінімальна вага задачі:</div>
            </div>
            <input
              type="number"
              className="form-control"
              autoComplete="off"
              name="minWeight"
              value={minWeight}
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div className="input-group mb-2">
            <div className="input-group-prepend">
              <div className="input-group-text">Максимальна вага задачі:</div>
            </div>
            <input
              type="number"
              className="form-control"
              autoComplete="off"
              name="maxWeight"
              value={maxWeight}
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div className="input-group mb-2">
            <div className="input-group-prepend">
              <div className="input-group-text">Кількість графів:</div>
            </div>
            <input
              type="number"
              className="form-control"
              autoComplete="off"
              name="graphCount"
              value={graphCount}
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div className="text-right">
            <input
              type="submit"
              className="btn btn-primary"
              value="
              Показати таблицю"
              disabled={this.state.cs === -1}
              onClick={e => this.onGenerate(e)}
            />
          </div>
        </form>
        {result &&
          [...new Set(result.map(e => e.nodesCount))].map((count, index) => {
            return this.renderTable(
              result.filter(i => i.nodesCount === count),
              index
            );
          })}
        <div
          className="modal fade bd-example-modal-lg"
          id="graphModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="graphModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="graphModalLabel">
                  Згенерований граф
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <GraphView
                  height="300px"
                  manipulationActive={false}
                  name="tasks"
                  data={openedGraph}
                  ref={this.tasksGraphRef}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Закрити
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade bd-example-modal-lg"
          id="modellingModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="modellingModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modellingModalLabel">
                  Діаграма Ганта
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {openedModel && (
                  <ModellingResult
                    resultMulti={openedModel}
                    cs={this.state.csData}
                  />
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Закрити
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  renderTable(results, key) {
    const extrems = {};
    Object.keys(results[0]).forEach(key => {
      const keyValues = results.map(result => {
        if (result[key].value) return result[key].value;
      });
      const max = Math.max(...keyValues);
      const min = Math.min(...keyValues);
      const reverse =
        key === "executionTimeMulti" || key === "executionTimeOne";
      extrems[key] = {
        max: reverse ? min : max,
        min: reverse ? max : min
      };
    });
    const availableCorrelation = [
      ...new Set(results.map(i => i.correlation.value))
    ];
    const availableMethods = [...new Set(results.map(i => i.algo.value))].sort(
      (a, b) => (a > b ? 1 : -1)
    );
    return (
      <React.Fragment>
        <h5>{`Таблиця для графу задач з кількістю задач: ${
          results[0].nodesCount
        }`}</h5>
        <table
          className="table table-sm table-responsive-xl table-bordered py-2"
          key={key}
        >
          <thead className="thead-light text-center">
            <tr>
              <th
                rowSpan="2"
                style={{ verticalAlign: "middle", textAlign: "center" }}
              >
                Зв'язність
              </th>
              <th
                rowSpan="2"
                style={{ verticalAlign: "middle", textAlign: "center" }}
              >
                Показник
              </th>
              <th
                colSpan={availableMethods.length}
                style={{ verticalAlign: "middle", textAlign: "center" }}
              >
                Алгоритм
              </th>
            </tr>
            <tr>
              {availableMethods.map((i, key) => (
                <th key={key}>{i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {availableCorrelation.map(correlation => {
              const values = results.filter(
                i => i.correlation.value === correlation
              );
              const renderKeys = [
                ...new Set(...values.map(i => Object.keys(i.renderInfo)))
              ];
              return renderKeys.map((key, i) => {
                return (
                  <tr>
                    {i === 0 && (
                      <td
                        rowSpan={renderKeys.length}
                        className="text-center"
                        style={{ verticalAlign: "middle", textAlign: "center" }}
                      >
                        <p>
                          <p>{correlation.toFixed(2)}</p>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              this.setState({ openedGraph: values[0].data })
                            }
                            data-toggle="modal"
                            data-target="#graphModal"
                          >
                            <FontAwesomeIcon icon={faEye} />
                            {"   "}Показати граф
                          </button>
                        </p>
                      </td>
                    )}
                    <React.Fragment>
                      <td style={{ verticalAlign: "middle" }}>
                        {values[0].renderInfo[key].title}
                      </td>
                      {availableMethods.map(value => {
                        const renderValue = values.filter(
                          v => v.algo.value === value
                        )[0].renderInfo[key].value;
                        if (key === "modellingInfo")
                          return (
                            <td className="text-center">
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  this.setState({ openedModel: renderValue })
                                }
                                data-toggle="modal"
                                data-target="#modellingModal"
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </button>
                            </td>
                          );
                        return <td className="text-center">{renderValue}</td>;
                      })}
                    </React.Fragment>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </React.Fragment>
    );
  }

  generate = () => {
    const result = [];
    const {
      graphCount,
      maxWeight,
      minWeight,
      minVertexNumb,
      stepVertexNumb,
      startCorrelation,
      endCorrelation,
      stepCorrelation: lengthOfCorrelationArray,
      csData
    } = this.state;
    let vertexNumb = minVertexNumb;
    const correlationStep =
      (parseFloat(endCorrelation) - parseFloat(startCorrelation)) /
      (parseFloat(lengthOfCorrelationArray) - 1);
    const correlationArray = Array(Math.floor(lengthOfCorrelationArray))
      .fill()
      .map(
        (_, idx) =>
          parseFloat(startCorrelation) + idx * parseFloat(correlationStep)
      );
    for (let i = 0; i < graphCount; i++) {
      for (let correlation of correlationArray) {
        const { nodes, edges } = new Generator(
          vertexNumb,
          maxWeight,
          minWeight,
          correlation
        ).generate();
        for (let queueNumber of this.queues) {
          const queue = new Queue(queueNumber, { nodes, edges });
          const queueRes = queue.run();
          for (let algo of this.models) {
            const { result: modellingResult, tasks: weights } = new Model(
              { nodes, edges },
              csData,
              queueRes,
              algo,
              2
            ).model();
            const { stats, info } = new Stats(
              modellingResult,
              queue,
              weights,
              csData.nodes.length
            ).getStats();
            const { executionTimeMulti } = info;
            result.push({
              nodesCount: nodes.length,
              correlation: {
                title: "Зв'язність",
                value: correlation
              },
              algo: {
                queue: queueNumber,
                assign: algo,
                value: `${algo} (${queueNumber})`
              },
              renderInfo: {
                ...stats,
                executionTimeMulti,
                modellingInfo: {
                  title: "Діаграма Ганта",
                  value: modellingResult
                }
              },
              data: { nodes, edges }
            });
          }
        }
      }
      vertexNumb += stepVertexNumb;
    }
    return result;
  };

  onGenerate(e) {
    e.preventDefault();
    this.setState({ result: undefined });
    const result = this.generate();
    this.setState({ result });
  }
}

export default StatisticsPage;
