import React from "react";

const QueueResultTable = function({ data }) {
  return (
    <table className="table my-4">
      <thead>
        <tr>
          <th>Номер у черзі</th>
          <th>Номер вершини</th>
          <th>Показник</th>
        </tr>
      </thead>
      <tbody>
        {data.map(function(queue, index) {
          console.log(queue);
          return (
            <tr key={index} data-item={queue}>
              <td>{index + 1}</td>
              <td>{queue.number}</td>
              <td>
                {queue.names.length === 1
                  ? `${queue.names} = ${queue.value.toFixed(2)}`
                  : `${queue.names[0]} = ${queue.value}, ${queue.names[1]} = ${
                      queue.weights
                    }`}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default QueueResultTable;
