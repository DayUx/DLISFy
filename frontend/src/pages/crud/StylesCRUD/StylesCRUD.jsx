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
const { Footer, Content } = Layout;
const { Search } = Input;
const { Text } = Typography;
const StylesCRUD = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setUploading] = useState(false);
  const [styles, setStyles] = useState([]);
  const [artistes, setArtistes] = useState([]);
  const searchRef = useRef(null);
  const [selectedArtiste, setSelectedArtiste] = useState([]);
  const [music, setMusic] = useState([]);
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
    }
  };
  useEffect(() => {
    onSearch(".*");
    fetch(API.searchArtistes + "/" + ".*", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Token": localStorage.getItem("access_token"),
      },
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setArtistes(data);
        });
      } else {
        notification.error({
          message: "Erreur",
          description: "Une erreur est survenue",
        });
      }
    });
  }, []);

  const onFinish = (values) => {
    fetch(API.createStyle, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Token": localStorage.getItem("access_token"),
      },
      body: JSON.stringify({
        name: values.name,
      }),
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          notification.success({
            message: "Succès",
            description: "Le style a bien été créé",
          });
          onSearch(searchRef.current.input.value);
          setImageUrl("");
        });
      } else {
        notification.error({
          message: "Erreur",
          description: "Une erreur est survenue",
        });
      }
    });
  };

  const updateStyle = (style) => {
    fetch(API.updateStyle + "/" + style._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Token": localStorage.getItem("access_token"),
      },
      body: JSON.stringify({
        name: style.name,
      }),
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          notification.success({
            message: "Succès",
            description: "Le style a bien été modifié",
          });
          onSearch(searchRef.current.input.value);
        });
      } else {
        notification.error({
          message: "Erreur",
          description: "Une erreur est survenue",
        });
      }
    });
  };

  const onSearch = (value) => {
    if (!value) {
      value = ".*";
    }
    fetch(API.searchStyles + "/" + value, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Token": localStorage.getItem("access_token"),
      },
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setStyles(data);
        });
      } else {
        notification.error({
          message: "Erreur",
          description: "Une erreur est survenue",
        });
      }
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
                key={style.id}
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
