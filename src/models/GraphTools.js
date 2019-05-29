function graphToMatrix(nodes, edges) {
  const matrix = {};
  nodes.forEach(node => {
    matrix[node.id] = [];
  });
  edges.forEach(edge => {
    matrix[edge.from].push(edge.to);
  });
  return matrix;
}

function isCyclic(nodes, edges) {
  const matrix = graphToMatrix(nodes, edges);
  const graphNodes = Object.keys(matrix);
  const visited = {};
  const recStack = {};

  for (let i = 0; i < graphNodes.length; i++) {
    const node = graphNodes[i];
    const cycleCheck = cyclicUtil(node, visited, recStack, matrix);
    if (cycleCheck !== -1) return { from: parseInt(node), to: cycleCheck };
  }
  return false;
}

function cyclicUtil(index, visited, recStack, matrix) {
  if (!visited[index]) {
    visited[index] = true;
    recStack[index] = true;
    const nodeNeighbors = matrix[index];
    for (let i = 0; i < nodeNeighbors.length; i++) {
      const currentNode = nodeNeighbors[i];
      if (
        !visited[currentNode] &&
        cyclicUtil(currentNode, visited, recStack, matrix) !== -1
      )
        return currentNode;
      else if (recStack[currentNode]) return currentNode;
    }
  }
  recStack[index] = false;
  return -1;
}

function isConnected(nodes, edges) {
  const connectedNodes = {};
  const graph = {};
  nodes.forEach(node => {
    connectedNodes[node.id] = [];
  });
  edges.forEach(edge => {
    connectedNodes[edge.from].push(edge.to);
    connectedNodes[edge.to].push(edge.from);
  });
  for (let id in connectedNodes) {
    if (!graph[id]) graph[id] = {};
    // eslint-disable-next-line
    connectedNodes[id].forEach(function(aid) {
      graph[id][aid] = 1;
      if (!graph[aid]) graph[aid] = {};
      graph[aid][id] = 1;
    });
  }
  let found = false;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes.get(i);
    if (!node) continue;
    const paths = isConnectedUtil(node.id, graph);
    if (Object.keys(paths).length !== Object.keys(graph).length) {
      found = true;
      break;
    }
  }
  return found;
}

function isConnectedUtil(s, graph) {
  const solutions = {};
  solutions[s] = [];
  solutions[s].dist = 0;

  while (true) {
    let parent = null;
    let nearest = null;
    let dist = Infinity;
    for (let n in solutions) {
      if (!solutions[n]) continue;
      const ndist = solutions[n].dist;
      const adj = graph[n];
      for (let a in adj) {
        if (solutions[a]) continue;
        const d = adj[a] + ndist;
        if (d < dist) {
          parent = solutions[n];
          nearest = a;
          dist = d;
        }
      }
    }

    if (dist === Infinity) {
      break;
    }

    solutions[nearest] = parent.concat(nearest);
    solutions[nearest].dist = dist;
  }

  return solutions;
}

module.exports = { isCyclic, isConnected };
