import { Button, Card, Col, Layout, Row, Space, Tag, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  CaretRightOutlined,
  DotChartOutlined,
  PauseOutlined,
} from "@ant-design/icons";
import { publish, subscribe } from "../../utils/events.jsx";
import { API } from "../../utils/API.jsx";
import { get } from "../../utils/CustomRequests.jsx";
import ArtistLink from "../link/ArtistLink.jsx";
import { BsDot } from "react-icons/all.js";

const Albums = ({ albums }) => {
  const [screenSize, setScreenSize] = useState(getCurrentDimension());

  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    subscribe("play", (e) => {
      setPlayingId(e.detail.albumId);
    });
    subscribe("pause", (e) => {
      setPlayingId(null);
    });
  }, []);
  const onClickPlay = (id) => {
    if (playingId === id) {
      publish("pause", { id: id });
    } else {
      get(API.getMusiquesByAlbumId + "/" + id, {
        success: (data) => {
          console.log(data[0]._id);
          const titles = data.map((song) => {
            return {
              titleId: song._id,
              fileId: song.data,
            };
          });
          publish("play", { id: data[0]._id, albumId: id, titles: titles });
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
      <Typography.Title level={3}>Albums</Typography.Title>
      <Row gutter={10}>
        {albums.map((album, index, grid) => {
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
            <Col key={index} span={24 / max}>
              <Card
                style={{
                  overflow: "hidden",
                }}
                bodyStyle={{
                  position: "relative",
                }}
                cover={
                  <img
                    src={album.image}
                    style={{
                      objectFit: "cover",
                      aspectRatio: 1.5,
                    }}
                  ></img>
                }
              >
                <Space direction={"vertical"}>
                  <Typography.Text
                    ellipsis={true}
                    strong
                    style={{
                      textAlign: "center",
                    }}
                    key={album.id}
                  >
                    {album.title}
                  </Typography.Text>
                  <Layout.Content
                    style={{
                      display: "flex",
                    }}
                  >
                    <Tag
                      style={{
                        marginRight: 5,
                      }}
                    >
                      {album.year}
                    </Tag>
                    {album?.artists?.map((artiste, index, grid) => {
                      return (
                        <Layout.Content key={index}>
                          <ArtistLink key={index} id={artiste}></ArtistLink>
                          {index < grid.length && grid.length !== 1
                            ? ","
                            : null}
                        </Layout.Content>
                      );
                    })}
                  </Layout.Content>
                </Space>
                <Button
                  shape={"circle"}
                  size={"large"}
                  type={"primary"}
                  style={{
                    filter: "drop-shadow(0px 0px 5px black)",

                    position: "absolute",
                    top: "0",
                    transform: "translateY(-50%)",
                    right: 10,
                  }}
                  icon={
                    playingId === album._id ? (
                      <PauseOutlined />
                    ) : (
                      <CaretRightOutlined />
                    )
                  }
                  onClick={() => {
                    onClickPlay(album._id);
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
export default Albums;
