import { Button, Table, Typography, Image, Layout, Space } from "antd";
import React, { useEffect, useState } from "react";
import { get, post } from "../../utils/CustomRequests.jsx";
import { API } from "../../utils/API.jsx";
import ArtistLink from "../../components/link/ArtistLink.jsx";
import {
  CaretRightOutlined,
  HeartFilled,
  HeartOutlined,
  PauseOutlined,
} from "@ant-design/icons";
import { publish, subscribe, unsubscribe } from "../../utils/events.jsx";
import { AiOutlineHeart } from "react-icons/ai";
const { Text, Title, Link } = Typography;

const Likes = () => {
  const [likes, setLikes] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
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
  const onClickPlay = (id) => {
    if (playingId === id) {
      publish("pause", { id: id });
    } else {
      const titles = likes.map((song) => {
        return {
          titleId: song._id,
          fileId: song.data,
        };
      });
      publish("play", { id: id, likes: true, titles: titles });
    }
  };
  const formatTime = (time) => {
    if (!time) return "--:--";
    const heures = Math.floor(time / 3600);
    const minutes = Math.floor((time - heures * 3600) / 60);
    const secondes = Math.floor(time - heures * 3600 - minutes * 60);
    if (heures !== 0) {
      return `${heures}:${minutes.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}:${secondes.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}`;
    }
    return `${minutes}:${secondes.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })}`;
  };
  const getLikes = () => {
    get(API.getLikes, {
      success: (data) => {
        setLikes(data);
      },
    });
  };

  useEffect(() => {
    const updateLikes = (e) => {
      getLikes();
    };
    subscribe("like", updateLikes);
    return () => {
      unsubscribe("like", updateLikes);
    };
  }, [likes]);
  useEffect(() => {
    getLikes();
    subscribe("play", (e) => {
      if (e.detail.likes) {
        setPlayingId(e.detail.id);
        return;
      }
      setPlayingId(null);
    });
    subscribe("pause", (e) => {
      setPlayingId(null);
    });
  }, []);
  const columns = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      width: 75,

      render: (_, { image }) => (
        <Image
          src={image}
          preview={false}
          style={{
            width: 50,
            height: 50,
            borderRadius: 5,
            objectFit: "cover",
          }}
        ></Image>
      ),
    },
    {
      title: "Titre",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Artiste",
      dataIndex: "artists",
      key: "artists",
      render: (_, { artists }) => (
        <>
          {artists.map((artist) => {
            return <ArtistLink id={artist}></ArtistLink>;
          })}
        </>
      ),
    },
    {
      title: "Durée",
      dataIndex: "duration",
      key: "duration",
      render: (_, { duration }) => {
        return <Text>{formatTime(duration)}</Text>;
      },
    },
    {
      title: "",
      key: "like",
      width: 75,
      render: (_, musique) => {
        return (
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
              likes.find((like) => like._id === musique._id) ? (
                <HeartFilled />
              ) : (
                <HeartOutlined />
              )
            }
            ghost
          />
        );
      },
    },
    {
      title: "",
      key: "play",
      width: 75,
      render: (_, musique) => {
        return (
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
              onClickPlay(musique._id);
            }}
          ></Button>
        );
      },
    },
  ];
  return (
    <Layout
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Space
        style={{
          padding: 30,
          alignItems: "center",
          boxSizing: "border-box",
          flex: 1,
        }}
        size={30}
      >
        <div
          style={{
            aspectRatio: 1,
            height: 150,
            background: `linear-gradient(45deg, #3f51b5 30%,#9c27b0 90%)`,
            filter: "drop-shadow(0px 0px 5px black)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
        <Space direction={"vertical"}>
          <Typography.Title
            style={{
              margin: 0,
            }}
          >
            Titres likés
          </Typography.Title>
          <Typography.Text>{likes.length} titres likés</Typography.Text>
        </Space>
      </Space>
      <Table
        columns={columns}
        style={{
          height: "calc(100vh - 500px + 8em)",
        }}
        dataSource={likes}
        pagination={{ pageSize: 50 }}
        scroll={{ y: "calc(100vh - 500px)" }}
      ></Table>
    </Layout>
  );
};

export default Likes;
