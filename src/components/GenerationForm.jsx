import React, { Component } from "react";

class GenerationForm extends Component {
  state = {
    vertexNumb: 5,
    maxWeight: 10,
    minWeight: 1,
    correlation: 0.5
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { vertexNumb, maxWeight, minWeight, correlation } = this.state;
    return (
      <div className="my-4">
        <h4>Генератор графу задач</h4>
        <form className="py-4">
          <div className="input-group mb-2">
            <div className="input-group-prepend">
              <div className="input-group-text">Кількість вершин (задач): </div>
            </div>
            <input
              type="number"
              className="form-control"
              autoComplete="off"
              name="vertexNumb"
              value={vertexNumb}
              onChange={this.handleChange}
            />
          </div>
          <div className="input-group mb-2">
            <div className="input-group-prepend">
              <div className="input-group-text">Максимальна вага вершини: </div>
            </div>
            <input
              type="number"
              className="form-control"
              name="maxWeight"
              min="1"
              autoComplete="off"
              value={maxWeight}
              onChange={this.handleChange}
            />
          </div>
          <div className="input-group mb-2">
            <div className="input-group-prepend">
              <div className="input-group-text">Мінімальна вага вершини: </div>
            </div>
            <input
              type="number"
              className="form-control"
              min="1"
              autoComplete="off"
              name="minWeight"
              value={minWeight}
              onChange={this.handleChange}
            />
          </div>
          <div className="input-group mb-2">
            <div className="input-group-prepend">
              <div className="input-group-text">Зв'язність: </div>
            </div>
            <input
              type="number"
              className="form-control"
              autoComplete="off"
              step="0.01"
              min="0"
              max="1"
              name="correlation"
              value={correlation}
              onChange={this.handleChange}
            />
          </div>
          <button
            className="btn btn-primary float-right"
            onClick={e => this.props.onGenerate(e, this.state)}
          >
            Згенерувати
          </button>
        </form>
      </div>
    );
  }
}

export default GenerationForm;
