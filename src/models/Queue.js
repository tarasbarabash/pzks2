import paths from "./Paths";

class Queue {
  constructor(method, data) {
    this._method = method;
    this._data = data;
  }

  run() {
    let result;
    switch (this._method) {
      case 1:
        result = this._run1();
        break;
      case 11:
        result = this._run11();
        break;
      default:
        throw new Error(`Unsupported algo`);
    }
    return result;
  }

  _toMatrix(reverse) {
    const { nodes, edges } = this._data;
    const matrix = [];
    edges.forEach(edge => {
      if (!reverse)
        matrix[edge.from] = {
          ...matrix[edge.from],
          [edge.to]: nodes.get(edge.to).weight
        };
      else
        matrix[edge.to] = {
          ...matrix[edge.to],
          [edge.from]: nodes.get(edge.from).weight
        };
    });
    return matrix;
  }

  _toEdgesArray(reverse) {
    const { edges } = this._data;
    const graph = [];
    edges.forEach(edge => {
      graph.push(!reverse ? [edge.from, edge.to] : [edge.to, edge.from]);
    });
    return graph;
  }

  _toUndirectedMatrix() {
    const { nodes, edges } = this._data;
    const matrix = [];
    edges.forEach(edge => {
      matrix[edge.to] = {
        ...matrix[edge.to],
        [edge.from]: nodes.get(edge.from).weight
      };
      matrix[edge.from] = {
        ...matrix[edge.from],
        [edge.to]: nodes.get(edge.to).weight
      };
    });
    return matrix;
  }

  _getPaths(from, to, reverse) {
    return paths({ graph: this._toEdgesArray(reverse), from, to });
  }

  _BFS(reverse = false) {
    const { nodes } = this._data;
    const allNodes = Object.keys(nodes._data);
    const matrixNodes = Object.keys(this._toMatrix(reverse));
    const endNodes = allNodes.filter(item => !matrixNodes.includes(item));
    const weights = {};
    const maxPaths = {};
    matrixNodes.forEach(i => {
      i = parseInt(i);
      let maxWeight = 0;
      let maxPath = [];
      endNodes.forEach(j => {
        j = parseInt(j);
        const paths = this._getPaths(i, j, reverse);
        paths.forEach(path => {
          const weight = path.reduce(
            (sum, node) => sum + nodes.get(node).weight,
            reverse ? -nodes.get(i).weight : 0
          );
          if (maxWeight < weight) {
            maxWeight = weight;
            maxPath = path;
          }
        });
        weights[j] = !reverse ? nodes.get(j).weight : 0;
        maxPaths[j] = [j];
      });
      weights[i] = maxWeight;
      maxPaths[i] = maxPath;
    });
    return { weights, maxPaths };
  }

  _run1() {
    const { nodes } = this._data;
    const { weights, maxPaths } = this._BFS();
    const graphWeight = Math.max(...Object.values(weights));
    const lengthes = Object.values(maxPaths).map(i => i.length);
    const graphLength = Math.max(...lengthes);
    let result = [];
    for (let i = 0; i < nodes.length; i++) {
      const value = weights[i] / graphWeight + lengthes[i] / graphLength;
      result.push({ number: i, value, names: [`Pr`] });
    }
    const sortedResult = result.sort((a, b) => b.value - a.value);
    return sortedResult;
  }

  _run11() {
    const adjMatrix = this._toUndirectedMatrix();
    const { nodes } = this._data;
    const allNodes = Object.keys(nodes._data);
    const { weights } = this._BFS(true);
    const result = allNodes.map(node => {
      return {
        number: node,
        value: adjMatrix[node] ? Object.keys(adjMatrix[node]).length : 0,
        weights: weights[node],
        names: [`Sv`, `Tкр.поч.`]
      };
    });
    const sortedResult = result.sort((a, b) => {
      if (a.value === b.value) {
        return a.weights - b.weights;
      }
      return b.value - a.value;
    });
    return sortedResult;
  }
}

export default Queue;
