import React, { Component, createRef } from "react";
import Queue from "../models/Queue";
import QueueResultTable from "./QueueResultTable";

class QueueView extends Component {
  constructor(props) {
    super(props);
    this.resultsRef = createRef();
    this.state = {
      data: props.data,
      results: [],
      algo: -1,
      description: {
        1: `У порядку спадання пронормованої суми критичних по часу і по кількості вершин шляхів до кінця графа задачі.`,
        2: `У порядку спадання критичного часу до кінця графу`,
        11: `У порядку спадання зв’язності вершин, а при рівних значеннях
              – в порядку зростання критичного по часу шляхів від початку графа
              задачі. `
      }
    };
  }

  handleOptionChange = e => {
    const algo = parseInt(e.target.value);
    this.setState({ algo });
    const queue = new Queue(algo, this.props.data);
    const results = queue.run();
    window.scrollTo(0, this.resultsRef.current.offsetTop);
    this.setState({ results });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.results.length > 0) {
      window.scrollTo(0, this.resultsRef.current.offsetTop);
    }
  }

  render() {
    const { results, algo, description } = this.state;
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor="algo">
            <h5>Алгоритм: </h5>
          </label>
          <select
            className="custom-select"
            name="algo"
            value={algo}
            onChange={this.handleOptionChange}
          >
            <option value="-1" disabled>
              Обрати
            </option>
            {Object.keys(description).map(i => {
              return (
                <option value={i} key={i}>
                  {i}
                </option>
              );
            })}
          </select>
        </div>
        <div ref={this.resultsRef}>
          {algo > 0 && (
            <div>
              <h5>Опис алгоритму: </h5>
              {description[algo]}
              <h5 className="my-2">Результат: </h5>
              <QueueResultTable data={results} />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default QueueView;
