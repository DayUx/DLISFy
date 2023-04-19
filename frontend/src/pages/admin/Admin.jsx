import React, { useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Layout,
  Typography,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Text, Link } = Typography;

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  return <Layout></Layout>;
};

export default Admin;
