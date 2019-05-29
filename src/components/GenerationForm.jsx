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
    if (this.props.handleUpdates) {
      this.props.handleUpdates(e);
    }
  };

  render() {
    const { vertexNumb, maxWeight, minWeight, correlation } = this.state;
    return (
      <div>
        {this.props.showTitle === true && <h4>Генератор графу задач</h4>}
        <form className="form-group">
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
          {this.props.showButton && (
            <div class="text-right">
              <button
                className="btn btn-primary"
                onClick={e => this.props.onGenerate(e, this.state)}
              >
                Згенерувати
              </button>
            </div>
          )}
        </form>
      </div>
    );
  }
}

export default GenerationForm;
