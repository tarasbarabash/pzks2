import { DataSet } from "vis";
import { isCyclic } from "./GraphTools";

class Generator {
  constructor(vertexNumb, maxWeight, minWeight, correlation, nodes, edges) {
    this.vertexNumb = vertexNumb;
    this.maxWeight = maxWeight;
    this.minWeight = minWeight;
    this.correlation = correlation;
    this.nodes = new DataSet();
    this.edges = new DataSet();
  }

  generate = () => {
    const nodes = this.nodes;
    const edges = this.edges;
    const newNodes = [];
    for (let i = 0; i < this.vertexNumb; i++) {
      const weight = this._getRandomInt(this.minWeight, this.maxWeight);
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
    const lengths = Math.round(
      (weights * (1 - this.correlation)) / this.correlation
    );
    const matrix = [];
    const arr = [];
    for (let i = 0; i < this.vertexNumb; i++) arr.push(0);
    for (let i = 0; i < this.vertexNumb; i++) matrix.push(arr.slice());
    let cur_l_w = 0;
    while (cur_l_w < lengths) {
      let number1 = this._getRandomInt(0, this.vertexNumb - 1);
      let number2 = this._getRandomInt(0, this.vertexNumb - 1);
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
    let cycle = isCyclic(nodes, edges);
    while (cycle) {
      // eslint-disable-next-line
      edges.forEach(edge => {
        if (edge.from === cycle.from && edge.to === cycle.to) {
          const weight = edge.weight;
          edges.remove(edge.id);
          const ids = edges.getIds();
          const randomEdgeId = ids[this._getRandomInt(0, ids.length)];
          const randowEdge = edges.get(randomEdgeId);
          edges.update({
            id: randomEdgeId,
            weight: randowEdge.weight + weight,
            label: `${randowEdge.weight + weight}`
          });
          cycle = isCyclic(nodes, edges);
          return;
        }
      });
    }
    return { nodes, edges, cur_l_w, weights };
  };

  _getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };
}

export default Generator;
