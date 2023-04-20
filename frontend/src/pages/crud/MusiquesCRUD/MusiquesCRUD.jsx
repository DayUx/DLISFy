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
const MusiquesCRUD = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setUploading] = useState(false);
  const [musiques, setMusiques] = useState([]);
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
    fetch(API.createMusique, {
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
            description: "L'musique a bien été créé",
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

  const updateMusique = (musique) => {
    fetch(API.updateMusique + "/" + musique._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Token": localStorage.getItem("access_token"),
      },
      body: JSON.stringify({
        name: musique.title,
        image: musique.image,
      }),
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          notification.success({
            message: "Succès",
            description: "L'musique a bien été modifié",
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
    fetch(API.searchMusiques + "/" + value, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Token": localStorage.getItem("access_token"),
      },
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setMusiques(data);
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
          {musiques.map((musique, index, array) => {
            return (
              <Card
                key={musique.id}
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
                          musique.image = reader.result;
                          updateMusique(musique);
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
                        src={musique.image}
                      />
                    </Upload>

                    <Text
                      editable={{
                        onChange: (value) => {
                          musique.title = value;
                          updateMusique(musique);
                        },
                      }}
                      strong
                    >
                      {musique.title}
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
          <Upload
            maxCount={1}
            iconRender={() => {
              return <PlusOutlined />;
            }}
            itemRender={(originNode, file, currFileList) => {
              const Player = ({ file }) => {
                const [audio, setAudio] = useState(null);

                useEffect(() => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => {
                    setAudio(reader.result);
                  };
                }, [file]);
                return <audio src={audio} controls></audio>;
              };
              return <Player file={file}></Player>;
            }}
            fileList={music}
            beforeUpload={(file) => {
              console.log(file);
              //verify that type is audio
              if (
                file.type !== "audio/mpeg" &&
                file.type !== "audio/mp3" &&
                file.type !== "audio/wav" &&
                file.type !== "audio/ogg"
              ) {
                notification.error({
                  message: "Erreur",
                  description:
                    "Le fichier doit être au format .mpeg, .mp3, .wav ou .ogg",
                });
                return false;
              }
              if (file.size / 1024 / 1024 > 3) {
                notification.error({
                  message: "Erreur",
                  description: "Le fichier ne doit pas dépasser 3Mo",
                });
                return false;
              }
              setMusic([file]);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Uploader le fichier audio</Button>
          </Upload>
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
                <div style={{ marginTop: 8 }}>Photo de couverture</div>
              </div>
            )}
          </Upload>
          <Form.Item
            name={"title"}
            rules={[
              {
                required: true,
                message: "Veuillez saisir un titre",
              },
            ]}
          >
            <Input placeholder={"Titre"}></Input>
          </Form.Item>
          <Form.Item name={"album"}>
            <Select placeholder={"Album"}></Select>
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
          <Form.Item name={"styles"}>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Style(s)"
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
          <Button type="primary" htmlType="submit">
            Ajouter une musique
          </Button>
        </Form>
      </Footer>
    </Layout>
  );
};

export default MusiquesCRUD;
