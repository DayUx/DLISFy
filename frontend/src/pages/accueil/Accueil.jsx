import { Button, Card, Col, Layout, Row, Space, Typography } from "antd";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { AiOutlineHeart } from "react-icons/all.js";
import { useNavigate, useNavigation } from "react-router-dom";
import Albums from "../../components/albums/Albums.jsx";
import { get } from "../../utils/CustomRequests.jsx";
import { API } from "../../utils/API.jsx";
const { Text, Title, Link } = Typography;
const Accueil = () => {
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  const [max, setMax] = useState(5);
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  useEffect(() => {
    get(API.searchAlbums + "/.*", {
      success: (data) => {
        setAlbums(data);
      },
    });
  }, []);
  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };

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
    setMax(max);
  }, [screenSize]);
  return (
    <Space
      direction={"vertical"}
      size={20}
      style={{
        height: "100%",
        width: "100%",
        padding: 30,
      }}
    >
      <Typography.Title
        style={{
          margin: 0,
        }}
      >
        Accueil
      </Typography.Title>
      <Row gutter={10}>
        <Col span={24 / max}>
          <Card
            style={{
              overflow: "hidden",
            }}
            className={"hover-opacity"}
            bodyStyle={{
              position: "relative",
            }}
            onClick={() => {
              navigate("/likes");
            }}
            cover={
              <div
                style={{
                  background: `linear-gradient(45deg, #3f51b5 30%,#9c27b0 90%)`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  objectFit: "cover",
                  aspectRatio: 1.5,
                  padding: 30,
                }}
              >
                <AiOutlineHeart
                  style={{
                    filter: "drop-shadow(0px 0px 5px black)",
                  }}
                  size={100}
                  color={"#fff"}
                ></AiOutlineHeart>
              </div>
            }
          >
            <Typography.Text
              ellipsis={true}
              strong
              style={{
                textAlign: "center",
              }}
            >
              Titres likés
            </Typography.Text>
          </Card>
        </Col>
      </Row>
      <Albums albums={albums}></Albums>
    </Space>
  );
};
export default Accueil;
