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
      <Footer
        style={{
          borderTop: "var(--border)",
        }}
      >
        <Form
          onFinish={onFinish}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "center",
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
          <Button type="primary" htmlType="submit">
            Ajouter un style
          </Button>
        </Form>
      </Footer>
    </Layout>
  );
};

export default StylesCRUD;
