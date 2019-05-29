function paths({ graph = [], from, to }, path = []) {
  return explore(from, to);

  function explore(currNode, to, paths = []) {
    path.push(currNode);
    for (let linkedNode of graph[currNode]) {
      if (linkedNode === to) {
        let result = path.slice();
        result.push(to);
        paths.push(result);
        continue;
      }
      if (
        !_hasEdgeBeenFollowedInPath({
          edge: {
            from: currNode,
            to: linkedNode
          },
          path
        })
      ) {
        explore(linkedNode, to, paths);
      }
    }
    path.pop();
    return paths;
  }
}

function _hasEdgeBeenFollowedInPath({ edge, path }) {
  var indices = _allIndices(path, edge.from);
  return indices.some(i => path[i + 1] === edge.to);
}

function _allIndices(arr, val) {
  var indices = [],
    i;
  for (i = 0; i < arr.length; i++) {
    if (arr[i] === val) {
      indices.push(i);
    }
  }
  return indices;
}

export default paths;
