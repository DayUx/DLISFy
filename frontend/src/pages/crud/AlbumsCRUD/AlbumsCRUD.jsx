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
  FloatButton,
  Modal,
  Select,
  InputNumber,
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
import { get, post, put } from "../../../utils/CustomRequests.jsx";
const { Footer, Content } = Layout;
const { Search } = Input;
const { Text } = Typography;
const AlbumsCRUD = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setUploading] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [artistes, setArtistes] = useState([]);

  const searchRef = useRef(null);
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
    }
  };
  useEffect(() => {
    onSearch(".*");
    get(API.searchArtistes + "/.*", {
      success: (data) => {
        setArtistes(data);
      },
    });
  }, []);

  const onFinish = (values) => {
    post(API.createAlbum, {
      body: {
        image: imageUrl,
        title: values.title,
        artists: values.artists,
        year: values.year,
      },
      success: (data) => {
        onSearch(searchRef.current.input.value);
        setIsModalVisible(false);
      },
      successMessage: "L'album a bien été créé",
    });
  };

  const updateAlbum = (album) => {
    put(API.updateAlbum + "/" + album._id, {
      body: album,
      success: () => {
        console.log("success");
        onSearch(searchRef.current.input.value);
      },

      successMessage: "L'album a bien été modifié",
    });
  };

  const onSearch = (value) => {
    if (!value) {
      value = ".*";
    }
    get(API.searchAlbums + "/" + value, {
      success: (data) => {
        setAlbums(data);
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
          {albums.map((artiste, index, array) => {
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
                          updateAlbum(artiste);
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
                          artiste.title = value;
                          updateAlbum(artiste);
                        },
                      }}
                      strong
                    >
                      {artiste.title}
                    </Text>
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      options={artistes.map((artiste) => {
                        return {
                          value: artiste._id,
                          label: artiste.name,
                        };
                      })}
                      onChange={(value) => {
                        artiste.artists = value;
                        updateAlbum(artiste);
                      }}
                      value={artiste.artists}
                    ></Select>
                    <Text
                      editable={{
                        onChange: (value) => {
                          artiste.year = value;
                          updateAlbum(artiste);
                        },
                      }}
                    >
                      {artiste.year}
                    </Text>
                  </Space>
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
            form={"formAlbums"}
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
          id={"formAlbums"}
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
            rules={[
              {
                required: true,
                message: "Veuillez saisir une couverture d'album",
              },
            ]}
          >
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              accept={"image/*"}
              beforeUpload={(file) => {
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
                  <div style={{ marginTop: 8 }}>Couverture d'album</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item
            name={"title"}
            rules={[
              {
                required: true,
                message: "Veuillez saisir un titre",
              },
            ]}
          >
            <Input placeholder="Titre" />
          </Form.Item>
          <Form.Item
            name={"artists"}
            rules={[
              {
                required: true,
                message: "Veuillez choisir au moins un artiste",
              },
            ]}
          >
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Artiste(s)"
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              options={artistes.map((artist) => {
                return {
                  label: artist.name,
                  value: artist._id,
                };
              })}
            ></Select>
          </Form.Item>
          <Form.Item
            name={"year"}
            rules={[
              {
                required: true,
                message: "Veuillez saisir une année",
              },
            ]}
          >
            <InputNumber placeholder="Année" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AlbumsCRUD;
