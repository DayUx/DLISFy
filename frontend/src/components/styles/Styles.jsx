import { Button, Card, Image, Space, Layout, Typography, Row, Col } from "antd";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { publish, subscribe } from "../../utils/events.jsx";
import ArtistLink from "../link/ArtistLink.jsx";
import { get } from "../../utils/CustomRequests.jsx";
import { API } from "../../utils/API.jsx";

const Styles = ({ styles, showAll }) => {
  const [playingId, setPlayingId] = useState(null);
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  const [stylesList, setStylesList] = useState([]);
  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  const randomBackgroundColors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#9e9e9e",
    "#607d8b",
  ];
  const getRandomColor = () => {
    return randomBackgroundColors[
      Math.floor(Math.random() * randomBackgroundColors.length)
    ];
  };

  useEffect(() => {
    setStylesList(
      styles.map((style) => {
        return {
          ...style,
          color1: getRandomColor(),
          color2: getRandomColor(),
        };
      })
    );
  }, [styles]);
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
      setPlayingId(e.detail.styleId);
    });
    subscribe("pause", (e) => {
      setPlayingId(null);
    });
  }, []);
  const onClickPlay = (id) => {
    if (playingId === id) {
      publish("pause", { id: id });
    } else {
      get(API.getMusiquesByStyleId + "/" + id, {
        success: (data) => {
          const titles = data.map((song) => {
            return {
              titleId: song._id,
              fileId: song.data,
            };
          });
          publish("play", { id: data[0]._id, styleId: id, titles: titles });
        },
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
      <Typography.Title level={3}>Genres</Typography.Title>

      <Row gutter={10}>
        {stylesList.map((style, index, array) => {
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
          if (index >= max * 4 && !showAll) {
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
                  aspectRatio: 1,
                  padding: 0,
                  background: `linear-gradient(45deg, ${style.color1} 30%, ${style.color2} 90%)`,
                }}
                bodyStyle={{
                  padding: "0 20px",
                }}
              >
                <Typography.Title
                  style={{
                    color: "white",
                    filter: "drop-shadow(0px 0px 5px black)",
                  }}
                  level={3}
                  strong
                >
                  {style.name}
                </Typography.Title>
                <Button
                  size={"large"}
                  shape={"circle"}
                  ghost={true}
                  style={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    filter: "drop-shadow(0px 0px 5px black)",
                  }}
                  icon={
                    playingId === style._id ? (
                      <PauseOutlined />
                    ) : (
                      <CaretRightOutlined />
                    )
                  }
                  onClick={() => {
                    onClickPlay(style._id, style.data);
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

export default Styles;
