import {
  AutoComplete,
  Button,
  Card,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Layout,
  Row,
  Typography,
  Select,
  Space,
} from "antd";
import { useState } from "react";
const { Option } = Select;
const { Text, Link } = Typography;

const Register = () => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return (
    <Layout
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "stretch",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input placeholder={"E-mail"} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value.length < 12) {
                    return Promise.reject(
                      new Error(
                        "Le mot de passe doit contenir au moins 12 caractères!"
                      )
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Mot de passe" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Veuillez confirmer votre mot de passe!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Les deux mots de passe que vous avez saisis ne correspondent pas!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder={"Confirmer le mot de passe"} />
          </Form.Item>

          <Form.Item
            name="pseudo"
            rules={[
              {
                required: true,
                message: "Veuillez saisir votre pseudo!",
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="Pseudo" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            S'inscrire
          </Button>
          <Space>
            <Text>Ou</Text>
            <Link
              onClick={() => {
                navigate("/login");
              }}
            >
              se conecter
            </Link>
          </Space>
        </Form>
      </Card>
    </Layout>
  );
};
export default Register;
