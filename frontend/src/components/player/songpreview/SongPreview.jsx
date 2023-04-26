import { Image, Layout, Row, Space, Typography, Skeleton, Button } from "antd";
import React, { useEffect, useState } from "react";
import ArtistLink from "../../link/ArtistLink.jsx";
import { publish, subscribe, unsubscribe } from "../../../utils/events.jsx";
import { get, post } from "../../../utils/CustomRequests.jsx";
import { API } from "../../../utils/API.jsx";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

const { Text } = Typography;
const SongPreview = ({ song, loading }) => {
  const [likes, setLikes] = useState([]);
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
    getLikes();
  }, []);

  const getLikes = () => {
    get(API.getLikesId, {
      success: (data) => {
        setLikes(data);
      },
    });
  };
  return (
    <Space align={"center"}>
      {song?.image ? (
        <Image
          style={{
            objectFit: "cover",
            borderRadius: 5,
          }}
          height={50}
          width={50}
          preview={false}
          src={song?.image}
        ></Image>
      ) : (
        <Skeleton.Image
          style={{
            width: 50,
            height: 50,
          }}
          active={loading}
          height={50}
          width={50}
        />
      )}

      <Layout>
        {song?.title || song?.artists.length !== 0 ? (
          <>
            <Text strong>{song?.title}</Text>
            <Text
              style={{
                opacity: 0.8,
              }}
            >
              {song?.artists?.map((artiste, index) => {
                return <ArtistLink key={index} id={artiste}></ArtistLink>;
              })}
            </Text>
          </>
        ) : (
          <Space direction={"vertical"}>
            <Skeleton.Input
              style={{
                height: 20,
              }}
            ></Skeleton.Input>
            <Skeleton.Input
              style={{
                height: 20,
              }}
            ></Skeleton.Input>
          </Space>
        )}
      </Layout>
      <Button
        shape={"circle"}
        type={"link"}
        size={"large"}
        onClick={() => {
          post(API.like + "/" + song._id, {
            success: (data) => {
              publish("like", data);
            },
          });
        }}
        icon={
          likes.find((id) => id === song?._id) ? (
            <HeartFilled />
          ) : (
            <HeartOutlined />
          )
        }
        ghost
      />
    </Space>
  );
};

export default SongPreview;
