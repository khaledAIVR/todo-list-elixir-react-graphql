import React, { ChangeEvent, useState } from "react";
import { TodoItem } from "./types/TodoItem";
import { gql, useMutation } from "@apollo/react-hooks";
import { GET_TODO_ITEMS } from "./TodoList";

const TOGGLE_TODO_ITEM = gql`
  mutation ($id: ID!) {
    toggleTodoItem(id: $id) {
      id
      isCompleted
    }
  }
`;
const UPDATE_TODO_ITEM = gql`
  mutation updateTodoItem($id: ID!, $content: String!) {
    updateTodoItem(id: $id, content: $content) {
      id
      content
    }
  }
`;

const DELETE_TODO_ITEM = gql`
  mutation deleteTodoItem($id: ID) {
    deleteTodoItem(id: $id)
  }
`;

const TodoListItem = ({ id, content, isCompleted }: TodoItem) => {
  const [text, setText] = useState(content);
  const [toggle_item] = useMutation(TOGGLE_TODO_ITEM);
  const [update_item] = useMutation(UPDATE_TODO_ITEM);
  const [delete_item] = useMutation(DELETE_TODO_ITEM, {
    update(cache) {
      const { todoItems } = cache.readQuery({ query: GET_TODO_ITEMS });
      cache.writeQuery({
        query: GET_TODO_ITEMS,
        data: {
          todoItems: todoItems.filter((item: TodoItem) => item.id !== id),
        },
      });
    },
  });
  const handle_toggle = () => {
    toggle_item({ variables: { id } });
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
  };

  const onBlur = () => {
    if (text === "") {
      delete_item({ variables: { id } });
      return;
    }

    if (text === content) return;

    update_item({ variables: { id, content: text } });
  };
  return (
    <div className={isCompleted ? "todo_item--completed" : "todo_item"}>
      <button
        className={`todo_item__toggle ${
          isCompleted ? "todo_item__toggle--completed" : ""
        }`}
        onClick={handle_toggle}
      />
      <input
        value={text}
        className="todo_item__content"
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
};

export default TodoListItem;
