import { useEffect, useState, useCallback } from "react";
import { Table, Space } from "antd";

import "antd/dist/antd.css";

import endpoint from "./endpoint.js";
import AddStudentForm from "./AddStudentForm";
import DeleteButton from "./DeleteButton.js";
import StudentModal from "./StudentModal.js";

const { Column } = Table;

function TableStudent() {
  const [student, setStudent] = useState([]);
  const [rerender, setReRender] = useState(false);

  useEffect(() => {
    handleGetStudents();
  }, [rerender]);

  const handleRender = useCallback(() => {
    setReRender((pre) => !pre);
  }, []);

  function handleCaculateAge(date) {
    if (!date) return "";
    const value = date.split(/[\/\\-\s]/)[2];

    if (!Number(value)) return "";

    const today = new Date();
    const current_year = today.getFullYear();

    // using regrex to split the "-". "/", " "
    return current_year - value;
  }

  function handleGetStudents() {
    // Create new header to void the 304 HTTP status
    const getMethodInit = {
      method: "GET",
      headers: {
        "cache-control": "no-cache",
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    fetch(endpoint, getMethodInit)
      .then((response) => response.json())
      .then((data) => {
        const newData = [...data];

        newData.forEach((value) => {
          value["age"] = handleCaculateAge(value.dob);
          value["key"] = value.id;
        });

        setStudent(data);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  return (
    <>
      <AddStudentForm onAddStudent={handleRender} />

      <Table dataSource={student} style={{ margin: 30 }} pagination={false}>
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="First Name" dataIndex="firstName" key="firstName" />
        <Column title="Last Name" dataIndex="lastName" key="lastName" />
        <Column title="Age" dataIndex="age" key="age" />

        <Column
          title="Action"
          key="action"
          render={(data) => (
            <Space size="middle">
              <StudentModal id={data.id} type="view" />
              <StudentModal
                id={data.id}
                type="edit"
                onUpdateStudent={handleRender}
              />
              <DeleteButton onDeleteStudent={handleRender} id={data.id} />
            </Space>
          )}
        />
      </Table>
    </>
  );
}

export default TableStudent;
