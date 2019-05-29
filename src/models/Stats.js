class Stats {
  constructor(result, queue, weights, csLength) {
    this.result = result;
    this.queue = queue;
    this.weights = weights;
    this.csLength = csLength;
  }

  getStats() {
    const executionTimeMulti =
      Math.max(
        ...Object.keys(this.result).map(key =>
          Math.max(...this.result[key].values.map(i => i.x))
        )
      ) - 1;
    const executionTimeOne = Object.keys(this.weights)
      .map(i => this.weights[i].weight)
      .reduce((a, b) => a + b);
    const { maxPaths } = this.queue.BFS();
    let graphCritical = Math.max(
      ...Object.keys(maxPaths).map(key =>
        maxPaths[key]
          .map(i => this.weights[i].weight)
          .reduce((sum, cur) => sum + cur)
      )
    );
    if (!isFinite(graphCritical))
      graphCritical = Math.max(
        ...Object.keys(this.weights).map(i => this.weights[i].weight)
      );
    const coefAccelaration = executionTimeOne / executionTimeMulti;
    const coefEfficiencyCS = coefAccelaration / this.csLength;
    const coefEfficiencyAlgo = graphCritical / executionTimeMulti;
    const stats = {
      coefAccelaration: {
        value: coefAccelaration.toFixed(2),
        title: "Коефіцієнт прискорення"
      },
      efficiency: {
        value: coefEfficiencyCS.toFixed(2),
        title: "Коефіцієнт ефективності системи"
      },
      algoEfficiency: {
        value: coefEfficiencyAlgo.toFixed(2),
        title: "Коефіцієнт ефективності алгоритму планування"
      }
    };
    const info = {
      executionTimeMulti: {
        value: executionTimeMulti,
        title: "Час виконання на КС"
      },
      executionTimeOne: {
        value: executionTimeOne,
        title: "Час виконання послідовно"
      },
      graphCritical: { value: graphCritical, title: "Критичний час графу" }
    };
    return { stats, info };
  }
}

export default Stats;
