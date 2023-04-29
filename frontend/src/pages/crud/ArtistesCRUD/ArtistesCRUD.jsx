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
const ArtistesCRUD = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setUploading] = useState(false);
  const [artistes, setArtistes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const searchRef = useRef(null);
  const [form] = Form.useForm();
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
    }
  };
  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);
  useEffect(() => {
    onSearch(".*");
  }, []);

  const onFinish = (values) => {
    post(API.createArtiste, {
      body: {
        image: imageUrl,
        name: values.name,
      },
      success: (data) => {
        onSearch(searchRef.current.input.value);
        setImageUrl("");
      },
      successMessage: "L'artiste a bien été créé",
    });
  };

  const updateArtiste = (artiste) => {
    put(API.updateArtiste + "/" + artiste._id, {
      body: {
        name: artiste.name,
        image: artiste.image,
      },
      success: (data) => {
        onSearch(searchRef.current.input.value);
      },
      successMessage: "L'artiste a bien été modifié",
    });
  };

  const onSearch = (value) => {
    if (!value) {
      value = ".*";
    }
    get(API.searchArtistes + "/" + value, {
      success: (data) => {
        setArtistes(data);
      },
    });
  };
  return (
    <Layout
      style={{
        height: "100vh",
      }}
    >
      <Search
        style={{
          padding: "30px 30px 0 30px",
          width: "100%",
        }}
        ref={searchRef}
        onSearch={onSearch}
      ></Search>
      <Space
        direction={"vertical"}
        style={{
          padding: "30px 30px 0 30px",

          width: "100%",
          marginTop: 30,
          flex: 1,
          overflowY: "scroll",
        }}
      >
        {artistes.map((artiste, index, array) => {
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
            form={"formArtistes"}
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
          id={"formArtistes"}
          form={form}
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
        </Form>
      </Modal>
    </Layout>
  );
};

export default ArtistesCRUD;
