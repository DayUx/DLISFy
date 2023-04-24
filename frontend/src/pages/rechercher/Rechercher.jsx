import { Button, Card, Image, Input, Layout, Space, Typography } from "antd";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import { get } from "../../utils/CustomRequests.jsx";
import { API } from "../../utils/API.jsx";
import { publish, subscribe } from "../../utils/events.jsx";
const { Text, Title, Link } = Typography;
const { Content } = Layout;
const { Search } = Input;

const Rechercher = forwardRef(({ playMusic = function () {} }, ref) => {
  const [musiques, setMusiques] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const [playingData, setPlayingData] = useState(null);
  const searchRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    onSearch(".*");
    subscribe("play", (e) => {
      setPlayingId(e.detail.id);
    });
    subscribe("pause", (e) => {
      setPlayingId(null);
    });
  }, []);

  const onSearch = (value) => {
    if (!value) {
      value = ".*";
    }
    get(API.searchMusiques + "/" + value, {
      success: (data) => {
        setMusiques(data);
      },
    });
  };

  const onClickPlay = (id) => {
    if (playingId === id && audioRef.current.played) {
      publish("pause", { id: id });
    } else {
      publish("play", { id: id });
    }
  };

  useEffect(() => {
    audioRef.current.play();
  }, [playingData]);

  return (
    <Layout
      style={{
        height: "100vh",
      }}
    >
      <audio
        ref={audioRef}
        src={playingData}
        onTimeUpdate={() => {
          console.log(audioRef.current.currentTime);
        }}
      ></audio>
      <Content
        style={{
          padding: "30px 30px 0 30px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Search ref={searchRef} onSearch={onSearch}></Search>
        <Space
          direction={"vertical"}
          style={{
            width: "100%",
            marginTop: 30,
            flex: 1,
            overflowY: "auto",
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
                      justifyContent: "space-between",
                    }}
                  >
                    <Space>
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

                      <Text strong>{musique.title}</Text>
                    </Space>

                    <Button
                      shape={"circle"}
                      type={"primary"}
                      icon={
                        playingId === musique._id ? (
                          <PauseOutlined />
                        ) : (
                          <CaretRightOutlined />
                        )
                      }
                      onClick={() => {
                        onClickPlay(musique._id);
                      }}
                    ></Button>
                  </Content>
                </Content>
              </Card>
            );
          })}
        </Space>
      </Content>
    </Layout>
  );
});
export default Rechercher;
