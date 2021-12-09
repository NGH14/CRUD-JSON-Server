import { memo, useState } from "react";
import { Button, Modal, Descriptions, Form, Input, message } from "antd";
import {
  ZoomInOutlined,
  FormOutlined,
  BorderlessTableOutlined,
} from "@ant-design/icons";

import endpoint from "./endpoint.js";

function StudentModal({
  id = 1,
  type = "view",
  onUpdateStudent = function () {},
}) {
  const [form] = Form.useForm();

  const [visibleModal, setVisibleModal] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);
  const [studentInfo, setStudentInfo] = useState({});
  const [updateStudent, setUpdateStudent] = useState({});

  function handleCancel(type) {
    type === "view"
      ? setVisibleModal(!visibleModal)
      : setDisplayForm(!displayForm);
  }

  function handleGetStudent(id) {
    // Create new header to void the 304 HTTP status
    const getMethodInit = {
      method: "GET",
      headers: {
        "cache-control": "no-cache",
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    fetch(`${endpoint}${id}`, getMethodInit)
      .then((response) => response.json())
      .then((data) => {
        form.setFieldsValue({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          dob: data.dob,
        });
        setStudentInfo(data);
        setUpdateStudent(data);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  function handleUpdateStudent(id) {
    const putMethodInput = {
      method: "PUT",
      body: JSON.stringify({
        firstName: updateStudent.firstName,
        lastName: updateStudent.lastName,
        email: updateStudent.email,
        dob: updateStudent?.dob,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    fetch(`${endpoint}${id}`, putMethodInput).catch((err) => {
      throw new Error(err);
    });

    message.success(`Update Student Success`);

    onUpdateStudent();
    handleCancel();
  }

  const handleUpdateInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setUpdateStudent((values) => ({
      ...values,
      [name]: value,
    }));
  };

  function handleModalAction(types) {
    handleGetStudent(id);

    types === "show"
      ? setVisibleModal(!visibleModal)
      : setDisplayForm(!displayForm);
  }

  return (
    <>
      {type === "view" && (
        <>
          <Button
            icon={<ZoomInOutlined style={{ color: "green" }} />}
            onClick={() => handleModalAction("show")}
          >
            Show
          </Button>

          <Modal
            visible={visibleModal}
            title={
              <>
                {<BorderlessTableOutlined />} <span>Information Modal</span>
              </>
            }
            onCancel={() => handleCancel("view")}
            onOk={() => handleCancel("view")}
            width={600}
            centered
            cancelButtonProps={{ style: { display: "none" } }}
          >
            <Descriptions title="Student Info">
              <Descriptions.Item label="First Name">
                {studentInfo.firstName}
              </Descriptions.Item>
              <Descriptions.Item label="Last Name">
                {studentInfo.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Date of Birth">
                {studentInfo.dob}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {studentInfo.email}
              </Descriptions.Item>
            </Descriptions>
          </Modal>
        </>
      )}

      {type === "edit" && (
        <>
          <Button
            icon={<FormOutlined style={{ color: "blue" }} />}
            onClick={() => handleModalAction()}
          >
            Edit
          </Button>

          <Modal
            visible={displayForm}
            title={
              <>
                {<BorderlessTableOutlined />} <span>Edit Student</span>
              </>
            }
            okText="Submit"
            onOk={() => handleUpdateStudent(id)}
            onCancel={() => handleCancel("edit")}
          >
            <Form layout="vertical" form={form}>
              <Form.Item name="firstName" label="First Name">
                <Input
                  name="firstName"
                  placeholder="Basic usage"
                  onChange={handleUpdateInput}
                />
              </Form.Item>
              <Form.Item name="lastName" label="Last Name">
                <Input
                  name="lastName"
                  placeholder="Basic usage"
                  onChange={handleUpdateInput}
                />
              </Form.Item>
              <Form.Item name="email" label="Email">
                <Input name="email" onChange={handleUpdateInput} />
              </Form.Item>
              <Form.Item name="dob" label="Day of Birth">
                <Input
                  name="dob"
                  placeholder="Basic usage"
                  onChange={handleUpdateInput}
                />
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </>
  );
}

export default memo(StudentModal);
