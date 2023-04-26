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
  Segmented,
  Modal,
  FloatButton,
} from "antd";

import React, { useEffect, useRef, useState } from "react";
import {
  CaretRightOutlined,
  CloseOutlined,
  CodepenOutlined,
  EditOutlined,
  LoadingOutlined,
  PauseOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { API } from "../../../utils/API.jsx";
import { get, post, put } from "../../../utils/CustomRequests.jsx";
const { Footer, Content } = Layout;
const { Search } = Input;
const { Text } = Typography;
const MusiquesCRUD = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setUploading] = useState(false);
  const [musiques, setMusiques] = useState([]);
  const [artistes, setArtistes] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [styles, setStyles] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [playingData, setPlayingData] = useState(null);
  const searchRef = useRef(null);
  const [selectedArtiste, setSelectedArtiste] = useState([]);
  const [music, setMusic] = useState([]);
  const audioRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const formRef = useRef(null);
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    setMusic([]);
    setImageUrl("");
  }, [isModalVisible]);

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
    }
  };
  useEffect(() => {
    onSearch(".*");
    get(API.searchArtistes + "/" + ".*", {
      success: (data) => {
        setArtistes(data);
      },
    });
    get(API.searchStyles + "/" + ".*", {
      success: (data) => {
        setStyles(data);
      },
    });
    get(API.searchAlbums + "/" + ".*", {
      success: (data) => {
        setAlbums(data);
      },
    });
  }, []);

  const onFinish = (values) => {
    const reader = new FileReader();
    reader.readAsDataURL(music[0]);
    reader.onload = () => {
      post(API.createMusique, {
        body: {
          image: imageUrl,
          title: values.title,
          artists: values.artists,
          styles: values.styles,
          album: values.album,
          data: reader.result,
          type: music[0].type,
        },
        success: (data) => {
          notification.success({
            message: "La musique a bien été créé",
          });
          onSearch(searchRef.current.input.value);
          setImageUrl("");
        },
      });
    };
  };

  const updateMusique = (musique) => {
    put(API.updateMusique + "/" + musique._id, {
      body: {
        image: musique.image,
        title: musique.title,
        artists: musique.artists,
        styles: musique.styles,
        album: musique.album,
        data: musique?.file,
        type: musique.type,
      },
      success: (data) => {
        onSearch(searchRef.current.input.value);
      },
      successMessage: "La musique a bien été modifiée",
    });
  };

  const onSearch = (value) => {
    if (!value) {
      value = ".*";
    }
    get(API.searchMusiques + "/" + value, {
      success: (data) => {
        console.log(data);
        setMusiques(data);
      },
    });
  };

  const onClickPlay = (id, data) => {
    if (!data) {
      notification.error({
        message: "Erreur",
        description: "Aucune musique n'a été trouvée",
      });
      return;
    }
    if (playingId === id && playingData) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setPlayingId(id);

      setPlayingData(API.streamMusique + "/" + data);
    }
  };

  useEffect(() => {
    audioRef.current.play();
    setIsPlaying(true);
  }, [playingData]);

  return (
    <Layout
      style={{
        height: "100vh",
      }}
    >
      <audio src={playingData} ref={audioRef}></audio>
      <Content
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Search
          style={{
            padding: "30px 30px 0 30px",
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
          {musiques.map((musique, index, array) => {
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
                  <Content
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      gap: 10,
                    }}
                  >
                    <Upload
                      className={"hover-opacity"}
                      accept={"image/*"}
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
                      style={{
                        flex: 1,
                      }}
                      strong
                    >
                      {musique.title}
                    </Text>
                    <Select
                      style={{
                        flex: 1,
                      }}
                      onClear={() => {
                        musique.album = null;
                        updateMusique(musique);
                      }}
                      allowClear={true}
                      value={musique.album}
                      options={albums.map((album) => {
                        return {
                          label: album.title,
                          value: album._id,
                        };
                      })}
                      onChange={(value) => {
                        musique.album = value;
                        updateMusique(musique);
                      }}
                    ></Select>
                    <Upload
                      showUploadList={false}
                      beforeUpload={(file) => {
                        console.log(file);
                        //verify that type is audio
                        if (
                          file.type !== "audio/mp3" &&
                          file.type !== "audio/wav" &&
                          file.type !== "audio/mpeg"
                        ) {
                          notification.error({
                            message: "Erreur",
                            description:
                              "Le fichier doit être au format .mp3 ou .wav",
                          });
                          return false;
                        }

                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => {
                          musique.file = reader.result;
                          musique.type = file.type;
                          updateMusique(musique);
                        };
                        return false;
                      }}
                    >
                      <Button
                        shape={"circle"}
                        icon={<UploadOutlined />}
                      ></Button>
                    </Upload>
                    <Button
                      icon={
                        playingId === musique._id && isPlaying ? (
                          <PauseOutlined />
                        ) : (
                          <CaretRightOutlined />
                        )
                      }
                      onClick={() => {
                        onClickPlay(musique._id, musique.data);
                      }}
                    ></Button>
                  </Content>
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
            form={"formMusiques"}
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
          ref={formRef}
          id={"formMusiques"}
          form={form}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "center",
          }}
        >
          <Form.Item>
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
              accept={".mp3,.wav"}
              beforeUpload={(file) => {
                setMusic([file]);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>
                Uploader le fichier audio
              </Button>
            </Upload>
          </Form.Item>

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
            <Select
              placeholder={"Album"}
              options={albums?.map((album) => {
                return {
                  label: album.title,
                  value: album._id,
                };
              })}
            ></Select>
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
            name={"styles"}
            rules={[
              {
                required: true,
                message: "Veuillez choisir au moins un style",
              },
            ]}
          >
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Style(s)"
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              options={styles.map((style) => {
                return {
                  label: style.name,
                  value: style._id,
                };
              })}
            ></Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default MusiquesCRUD;
