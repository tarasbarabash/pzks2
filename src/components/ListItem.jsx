import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faThList,
  faPen,
  faClone
} from "@fortawesome/free-solid-svg-icons";

const ListItem = ({ item, index, onDelete, onClone, name }) => {
  return (
    <tr>
      <th scope="row">{index + 1}</th>
      <td>
        <Link to={`/${name}/${item.id}`}>
          {item.name ? item.name : "Без імені"}
        </Link>
      </td>
      <td>
        {new Date(item.created).toLocaleString("uk-UA", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric"
        })}
      </td>
      <td>
        {new Date(item.updated).toLocaleString("uk-UA", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric"
        })}
      </td>
      <td>
        <div className="btn-group" role="group">
          {name === "tasks" && (
            <Link
              to={`/tasks/${item.id}/queue`}
              className="btn btn-primary btn-sm"
              title="Сформувати чергу"
            >
              <FontAwesomeIcon icon={faThList} />
            </Link>
          )}
          <Link
            to={`/${name}/${item.id}`}
            className="btn btn-primary btn-sm"
            title="Редагувати"
          >
            <FontAwesomeIcon icon={faPen} />
          </Link>
          <button
            type="button"
            className="btn btn-info btn-sm"
            onClick={() => onClone(item.id)}
            title="Клонувати"
          >
            <FontAwesomeIcon icon={faClone} />
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(item.id)}
            title="Видалити"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ListItem;
