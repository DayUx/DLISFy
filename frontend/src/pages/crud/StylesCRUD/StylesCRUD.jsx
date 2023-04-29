import {
  Button,
  Card,
  Form,
  Input,
  Layout,
  notification,
  Space,
  Upload,
  Typography,
  Image,
  Select,
  Tooltip,
  FloatButton,
  Modal,
} from "antd";

import React, { useEffect, useRef, useState } from "react";
import {
  CloseOutlined,
  CodepenOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { API } from "../../../utils/API.jsx";
import { get, post, put } from "../../../utils/CustomRequests.jsx";
const { Footer, Content } = Layout;
const { Search } = Input;
const { Text } = Typography;
const StylesCRUD = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setUploading] = useState(false);
  const [styles, setStyles] = useState([]);
  const searchRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    onSearch(".*");
  }, []);

  const onFinish = (values) => {
    post(API.createStyle, {
      body: {
        name: values.name,
      },
      success: (data) => {
        onSearch(searchRef.current.input.value);
        setImageUrl("");
      },
      successMessage: "Le style a bien été créé",
    });
  };

  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);

  const updateStyle = (style) => {
    put(API.updateStyle + "/" + style._id, {
      body: {
        name: style.name,
      },
      success: (data) => {
        onSearch(searchRef.current.input.value);
      },
      successMessage: "Le style a bien été modifié",
    });
  };

  const onSearch = (value) => {
    if (!value) {
      value = ".*";
    }
    get(API.searchStyles + "/" + value, {
      success: (data) => {
        setStyles(data);
      },
    });
  };
  return (
    <Layout
      style={{
        height: "100vh",
      }}
    >
      <Content
        style={{
          padding: 30,
        }}
      >
        <Search ref={searchRef} onSearch={onSearch}></Search>
        <Space
          direction={"vertical"}
          style={{
            width: "100%",
            marginTop: 30,
          }}
        >
          {styles.map((style, index, array) => {
            return (
              <Card
                key={index}
                style={{
                  width: "100%",
                  padding: 0,
                }}
                bodyStyle={{
                  padding: 10,
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Content
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    editable={{
                      onChange: (value) => {
                        style.name = value;
                        updateStyle(style);
                      },
                    }}
                    strong
                  >
                    {style.name}
                  </Text>
                </Content>
              </Card>
            );
          })}
        </Space>
      </Content>
      <FloatButton
        type={"primary"}
        onClick={() => setIsModalVisible(true)}
        icon={<PlusOutlined />}
      ></FloatButton>
      <Modal
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        centered={true}
        footer={[
          <Button
            form={"formStyles"}
            key={"submit"}
            htmlType={"submit"}
            type={"primary"}
          >
            Ajouter
          </Button>,
          <Button
            onClick={() => {
              setIsModalVisible(false);
            }}
          >
            Fermer
          </Button>,
        ]}
      >
        <Form
          onFinish={onFinish}
          id={"formStyles"}
          form={form}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "center",
            paddingTop: 20,
          }}
        >
          <Form.Item
            name={"name"}
            rules={[
              {
                required: true,
                message: "Veuillez saisir un nom",
              },
            ]}
          >
            <Input placeholder={"Nom"}></Input>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default StylesCRUD;
