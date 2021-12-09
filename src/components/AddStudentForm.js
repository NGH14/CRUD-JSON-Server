import { useState, memo, useRef } from "react";
import { Input, Row, Col, Button, Form, message } from "antd";
import {
  UserAddOutlined,
  UserOutlined,
  MailOutlined,
  ContainerOutlined,
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import endpoint from "./endpoint.js";

function AddStudentForm({ onAddStudent }) {
  const [addButtonState, setAddButtonState] = useState(false);
  const [inputs, setInputs] = useState({});
  const [form] = Form.useForm();

  const inputFirstname = useRef();

  const colorButton = addButtonState ? "#f5222d" : "#1890ff";

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  function HandleAddStudent() {
    const postMethodInput = {
      method: "POST",
      body: JSON.stringify({
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        email: inputs.email,
        dob: inputs?.dob,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    fetch(endpoint, postMethodInput).catch((err) => {
      throw new Error(err);
    });

    message.success(`Add  ${inputs.firstName} Success`);

    onAddStudent();

    form.resetFields();
    inputFirstname.current.focus();
  }

  return (
    <>
      <Button
        shape="circle"
        icon={addButtonState ? <CloseOutlined /> : <PlusOutlined />}
        size="large"
        style={{
          backgroundColor: colorButton,
          border: "none",
          margin: "0 30px 15px",
        }}
        type="primary"
        onClick={() => setAddButtonState(!addButtonState)}
      ></Button>

      {addButtonState && (
        <Form
          form={form}
          name="addStudent"
          autoComplete="off"
          onFinish={() => {
            HandleAddStudent();
          }}
          style={{
            margin: "0 30px 0px",
          }}
        >
          <Row gutter={30} style={{ marginTop: 10, marginBottom: 10 }}>
            <Col className="gutter-row" span={6}>
              <Form.Item name={["First name"]} rules={[{ required: true }]}>
                <Input
                  ref={inputFirstname}
                  addonBefore={<UserOutlined />}
                  size="large"
                  placeholder="First Name"
                  name="firstName"
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>

            <Col className="gutter-row" span={6}>
              <Form.Item name={["Last name"]} rules={[{ required: true }]}>
                <Input
                  addonBefore={<UserOutlined />}
                  size="large"
                  placeholder="Last Name"
                  name="lastName"
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <Form.Item name={["Email"]} rules={[{ required: true }]}>
                <Input
                  addonBefore={<MailOutlined />}
                  size="large"
                  placeholder="Emai"
                  name="email"
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <Form.Item name={["Day of Birth"]}>
                <Input
                  addonBefore={<ContainerOutlined />}
                  size="large"
                  placeholder="Date of Birth: DD/MM/YYYY"
                  name="dob"
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="center">
            <Form.Item>
              <Button
                icon={<UserAddOutlined />}
                style={{ marginBottom: 30, textAlign: "right" }}
                htmlType="submit"
                type="primary"
              >
                Add Student
              </Button>
            </Form.Item>
          </Row>
        </Form>
      )}
    </>
  );
}

export default memo(AddStudentForm);
