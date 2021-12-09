import { memo } from "react";
import { Button, Popconfirm, message } from "antd";

import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

import endpoint from "./endpoint.js";

function DeleteButton({ onDeleteStudent = function () {}, id = 1 }) {
  function HandleDeleteStudent(id) {
    const deleteMethodInput = {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    fetch(`${endpoint}${id}`, deleteMethodInput).catch((err) => {
      throw new Error(err);
    });

    message.success(`Delete Student Success`);

    onDeleteStudent();
  }

  return (
    <>
      <Popconfirm
        placement="top"
        icon={<QuestionCircleOutlined style={{ color: "red" }} />}
        title={"Are you sure to delete this student?"}
        onConfirm={() => HandleDeleteStudent(id)}
        okText="Delete"
        cancelText="Cancel"
        okType="danger"
      >
        <Button icon={<DeleteOutlined style={{ color: "red" }} />}>
          Delete
        </Button>
      </Popconfirm>
    </>
  );
}

export default memo(DeleteButton);
