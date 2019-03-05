import React from "react";
import ListItem from "./ListItem";

const GraphList = ({ list, onDelete, onClone, name }) => {
  if (!list || list.length < 1)
    return <h6 className="text-center my-2 text-secondary">Список пустий</h6>;
  const items = list
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .map((item, index) => (
      <ListItem
        key={item.id}
        item={item}
        index={index}
        onDelete={onDelete}
        onClone={onClone}
        name={name}
      />
    ));
  return (
    <React.Fragment>
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>#</th>
            <th style={{ width: "30%" }}>Ім'я</th>
            <th style={{ width: "25%" }}>Створено</th>
            <th style={{ width: "25%" }}>Оновлено</th>
            <th style={{ width: "10%" }}>Операції</th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </table>
    </React.Fragment>
  );
};

export default GraphList;
