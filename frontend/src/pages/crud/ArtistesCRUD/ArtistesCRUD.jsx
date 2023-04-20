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
} from "antd";

import React, { useEffect, useRef, useState } from "react";
import {
  CloseOutlined,
  CodepenOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { API } from "../../../utils/API.jsx";
const { Footer, Content } = Layout;
const { Search } = Input;
const { Text } = Typography;
const ArtistesCRUD = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setUploading] = useState(false);
  const [artistes, setArtistes] = useState([]);

  const searchRef = useRef(null);
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
    }
  };
  useEffect(() => {
    onSearch(".*");
  }, []);

  const onFinish = (values) => {
    fetch(API.createArtiste, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Token": localStorage.getItem("access_token"),
      },
      body: JSON.stringify({
        image: imageUrl,
        name: values.name,
      }),
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          notification.success({
            message: "Succès",
            description: "L'artiste a bien été créé",
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

  const updateArtiste = (artiste) => {
    fetch(API.updateArtiste + "/" + artiste._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Token": localStorage.getItem("access_token"),
      },
      body: JSON.stringify({
        name: artiste.name,
        image: artiste.image,
      }),
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          notification.success({
            message: "Succès",
            description: "L'artiste a bien été modifié",
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
    fetch(API.searchArtistes + "/" + value, {
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
          {artistes.map((artiste, index, array) => {
            return (
              <Card
                key={artiste.id}
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
                  <Space
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Upload
                      className={"hover-opacity"}
                      showUploadList={false}
                      beforeUpload={(file) => {
                        if (
                          file.type !== "image/jpeg" &&
                          file.type !== "image/png"
                        ) {
                          notification.error({
                            message: "Erreur",
                            description:
                              "Le fichier doit être au format .jpg ou .png",
                          });
                          setUploading(false);
                          return false;
                        }
                        if (file.size / 1024 / 1024 > 2) {
                          notification.error({
                            message: "Erreur",
                            description: "Le fichier ne doit pas dépasser 2Mo",
                          });
                          setUploading(false);
                          return false;
                        }
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => {
                          artiste.image = reader.result;
                          updateArtiste(artiste);
                        };
                        return false;
                      }}
                      onChange={handleChange}
                    >
                      <Image
                        preview={false}
                        style={{
                          width: 50,
                          objectFit: "cover",
                          height: 50,
                          borderRadius: 5,
                        }}
                        src={artiste.image}
                      />
                    </Upload>

                    <Text
                      editable={{
                        onChange: (value) => {
                          artiste.name = value;
                          updateArtiste(artiste);
                        },
                      }}
                      strong
                    >
                      {artiste.name}
                    </Text>
                  </Space>
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
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={(file) => {
                if (file.type !== "image/jpeg" && file.type !== "image/png") {
                  notification.error({
                    message: "Erreur",
                    description: "Le fichier doit être au format .jpg ou .png",
                  });
                  setUploading(false);
                  return false;
                }
                if (file.size / 1024 / 1024 > 2) {
                  notification.error({
                    message: "Erreur",
                    description: "Le fichier ne doit pas dépasser 2Mo",
                  });
                  setUploading(false);
                  return false;
                }
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                  setImageUrl(reader.result);
                  setUploading(false);
                };
                return false;
              }}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Photo de profil</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item
            name={"name"}
            rules={[
              {
                required: true,
                message: "Veuillez entrer un nom",
              },
            ]}
          >
            <Input placeholder="Nom" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Ajouter un artiste
          </Button>
        </Form>
      </Footer>
    </Layout>
  );
};

export default ArtistesCRUD;
