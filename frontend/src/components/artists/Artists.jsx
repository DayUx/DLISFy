import { Button, Card, Col, Row, Space, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import { publish, subscribe } from "../../utils/events.jsx";
import { API } from "../../utils/API.jsx";
import { get } from "../../utils/CustomRequests.jsx";

const Artists = ({ artists }) => {
  const [screenSize, setScreenSize] = useState(getCurrentDimension());

  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    subscribe("play", (e) => {
      setPlayingId(e.detail.artistId);
    });
    subscribe("pause", (e) => {
      setPlayingId(null);
    });
  }, []);
  const onClickPlay = (id) => {
    if (playingId === id) {
      publish("pause", { id: id });
    } else {
      get(API.getMusiquesByArtisteId + "/" + id, {
        success: (data) => {
          console.log(data[0]._id);
          const titles = data.map((song) => {
            return {
              titleId: song._id,
              fileId: song.data,
            };
          });
          publish("play", { id: data[0]._id, artistId: id, titles: titles });
        },
      });
    }
  };

  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [screenSize]);

  return (
    <Space
      style={{
        width: "100%",
      }}
      direction={"vertical"}
    >
      <Typography.Title level={3}>Artistes</Typography.Title>
      <Row>
        {artists.map((artist, index, grid) => {
          const width = screenSize.width;
          let max = Math.floor(width / 200);
          if (max === 5) {
            max = 4;
          }
          if (max === 7) {
            max = 6;
          }
          if (max > 8) {
            max = 8;
          }
          if (index >= max) {
            return null;
          }
          return (
            <Col
              style={{
                padding: 5,
              }}
              key={index}
              span={24 / max}
            >
              <Card
                style={{
                  overflow: "hidden",
                }}
                bodyStyle={{
                  position: "relative",
                }}
                cover={
                  <img
                    src={artist.image}
                    style={{
                      objectFit: "cover",
                      aspectRatio: 1.5,
                    }}
                  ></img>
                }
              >
                <Typography.Text
                  ellipsis={true}
                  strong
                  style={{
                    textAlign: "center",
                  }}
                  key={artist.id}
                >
                  {artist.name}
                </Typography.Text>
                <Button
                  shape={"circle"}
                  size={"large"}
                  type={"primary"}
                  style={{
                    position: "absolute",
                    top: "0",
                    transform: "translateY(-50%)",
                    right: 10,
                  }}
                  icon={
                    playingId === artist._id ? (
                      <PauseOutlined />
                    ) : (
                      <CaretRightOutlined />
                    )
                  }
                  onClick={() => {
                    onClickPlay(artist._id);
                  }}
                ></Button>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Space>
  );
};
export default Artists;
