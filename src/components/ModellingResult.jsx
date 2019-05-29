import React, { Component } from "react";

import {
  XYPlot,
  LabelSeries,
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  YAxis,
  LineMarkSeries,
  LineSeries
} from "react-vis";

class ModellingResult extends Component {
  state = {};
  renderLines = lines => {
    return Object.keys(lines).map(lineId => {
      const line = lines[lineId];
      return (
        <LineMarkSeries
          data={line.values}
          key={lineId}
          color={line.color}
          strokeWidth={3.5}
          animation={"nowobble"}
          strokeDasharray={lineId.length > 3 ? [7, 3] : []}
        />
      );
    });
  };

  renderLabels = lines => {
    return Object.keys(lines).map(lineId => {
      const line = lines[lineId];
      const start = line.values[0];
      const end = line.values[1];
      const x = start.x + (end.x - start.x) / 2;
      const y = start.y + 0.1;
      return (
        <LabelSeries
          data={[{ x, y, label: lineId }]}
          style={{ fontSize: "8pt" }}
          key={lineId}
          labelAnchorY="auto"
          labelAnchorХ="auto"
        />
      );
    });
  };

  renderProcessorsLines = result => {
    return this.props.cs.nodes.map(cs => {
      return (
        <LineSeries
          data={[{ x: 0.5, y: cs.id }, { x: this.getMax(result), y: cs.id }]}
          key={cs.id}
          color={"#d1d1d1"}
          strokeWidth={4}
        />
      );
    });
  };

  getMax = result =>
    Math.max(...[].concat(...Object.values(result)).map(o => o.values[1].x)) +
    0.5;

  render() {
    const { cs, resultMulti } = this.props;
    return (
      <div
        style={{
          overflow: "auto",
          whiteSpace: "nowrap"
        }}
      >
        <XYPlot
          className="my-4"
          height={600}
          width={65 * this.getMax(resultMulti)}
          xType="linear"
          yType="linear"
          xDomain={[0.5, this.getMax(resultMulti)]}
          yDomain={[
            Math.min(...cs.nodes.map(node => node.id)) - 0.5,
            Math.max(...cs.nodes.map(node => node.id)) + 0.5
          ]}
        >
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis title="Такт" position="end" />
          <YAxis
            title="ПЕ"
            position="end"
            tickValues={[...cs.nodes.map(node => node.id)]}
            tickFormat={numb => parseFloat(numb).toFixed(0)}
          />
          {this.renderProcessorsLines(resultMulti)}
          {this.renderLines(resultMulti)}
          {this.renderLabels(resultMulti)}
        </XYPlot>
      </div>
    );
  }
}

export default ModellingResult;
