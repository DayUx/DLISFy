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
  notification,
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { API } from "../../utils/API.jsx";
const { Option } = Select;
const { Text, Link } = Typography;

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    fetch(API.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
        username: values.username,
      }),
    }).then((r) => {
      if (r.ok) {
        r.json().then((data) => {
          notification.success({
            message: "Succès",
            description: "Vous êtes maintenant inscrit!",
            duration: 3,
          });
          localStorage.setItem("access_token", data.access_token);
          navigate("/");
        });
      } else {
        r.json().then((data) => {
          notification.error({
            message: "Erreur",
            description: data.detail,
            duration: 3,
          });
        });
      }
    });
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
          maxWidth: "500px",
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
                message: "L'adresse e-mail n'est pas valide!",
              },
              {
                required: true,
                message: "Veuillez saisir votre adresse e-mail!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder={"Adresse e-mail"} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Veuillez saisir votre mot de passe!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value?.length < 12) {
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
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Mot de passe"
            />
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
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder={"Confirmer le mot de passe"}
            />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Veuillez saisir votre pseudo!",
                whitespace: true,
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Pseudo"
            />
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
              connectez vous!
            </Link>
          </Space>
        </Form>
      </Card>
    </Layout>
  );
};
export default Register;
