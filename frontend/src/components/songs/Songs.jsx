import { Button, Card, Image, Space, Layout, Typography, Row, Col } from "antd";
import {
  CaretRightOutlined,
  HeartFilled,
  HeartOutlined,
  PauseOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { publish, subscribe, unsubscribe } from "../../utils/events.jsx";
import ArtistLink from "../link/ArtistLink.jsx";
import { API } from "../../utils/API.jsx";
import { get, post } from "../../utils/CustomRequests.jsx";

const Songs = ({ songs, showAll }) => {
  const [playingId, setPlayingId] = useState(null);
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  const [likes, setLikes] = useState([]);

  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  useEffect(() => {
    const updateLikes = (e) => {
      setLikes(e.detail);
    };
    subscribe("like", updateLikes);
    return () => {
      unsubscribe("like", updateLikes);
    };
  }, [likes]);

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [screenSize]);
  useEffect(() => {
    subscribe("play", (e) => {
      if (
        e.detail.playlistId ||
        e.detail.albumId ||
        e.detail.artistId ||
        e.detail.styleId ||
        e.detail.likes
      ) {
        setPlayingId(null);
        return;
      }
      setPlayingId(e.detail.id);
    });
    subscribe("pause", (e) => {
      setPlayingId(null);
    });

    getLikes();
  }, []);

  const getLikes = () => {
    get(API.getLikesId, {
      success: (data) => {
        setLikes(data);
      },
    });
  };

  const onClickPlay = (id, data) => {
    if (playingId === id) {
      publish("pause", {
        id: id,
        titles: [
          {
            titleId: id,
            fileId: data,
          },
        ],
      });
    } else {
      publish("play", {
        id: id,
        titles: [
          {
            titleId: id,
            fileId: data,
          },
        ],
      });
    }
  };
  return (
    <Space
      style={{
        width: "100%",
      }}
      direction={"vertical"}
    >
      <Typography.Title level={3}>Titres</Typography.Title>

      <Row
        gutter={10}
        style={{
          width: "100%",

          flex: 1,
          overflowY: "auto",
        }}
      >
        {songs.map((musique, index, array) => {
          const width = screenSize.width;
          let max = Math.floor(width / 450);
          if (max === 5) {
            max = 4;
          }
          if (max === 7) {
            max = 6;
          }
          if (max > 8) {
            max = 8;
          }
          if (index >= 20 && !showAll) {
            return null;
          }
          return (
            <Col
              key={index}
              style={{
                marginBottom: 10,
              }}
              span={24 / max}
            >
              <Card
                style={{
                  width: "100%",
                  padding: 0,
                  paddingRight: 10,
                  overflow: "hidden",
                }}
                bodyStyle={{
                  padding: 0,
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Layout.Content
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Layout.Content
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
                          width: 60,
                          objectFit: "cover",
                          height: 60,
                        }}
                        src={musique.image}
                      />
                      <Space size={1} direction={"vertical"}>
                        <Typography.Text strong>
                          {musique.title}
                        </Typography.Text>
                        <Layout.Content>
                          {musique?.artists?.map((artiste, index, grid) => {
                            return (
                              <Layout.Content key={index}>
                                <ArtistLink
                                  key={index}
                                  id={artiste}
                                ></ArtistLink>
                                {index < grid.length && grid.length !== 1
                                  ? ","
                                  : null}
                              </Layout.Content>
                            );
                          })}
                        </Layout.Content>
                      </Space>
                    </Space>
                    <Space>
                      <Button
                        shape={"circle"}
                        type={"link"}
                        size={"large"}
                        onClick={() => {
                          post(API.like + "/" + musique._id, {
                            success: (data) => {
                              publish("like", data);
                            },
                          });
                        }}
                        icon={
                          likes.find((id) => id === musique._id) ? (
                            <HeartFilled />
                          ) : (
                            <HeartOutlined />
                          )
                        }
                        ghost
                      />

                      <Button
                        shape={"circle"}
                        type={"primary"}
                        ghost
                        icon={
                          playingId === musique._id ? (
                            <PauseOutlined />
                          ) : (
                            <CaretRightOutlined />
                          )
                        }
                        onClick={() => {
                          onClickPlay(musique._id, musique.data);
                        }}
                      ></Button>
                    </Space>
                  </Layout.Content>
                </Layout.Content>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Space>
  );
};

export default Songs;
