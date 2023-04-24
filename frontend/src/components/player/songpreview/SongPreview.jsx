import { Image, Layout, Row, Space, Typography, Skeleton } from "antd";
import { useEffect } from "react";
import ArtistLink from "../../link/ArtistLink.jsx";

const { Text } = Typography;
const SongPreview = ({ song, loading }) => {
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
    </Space>
  );
};

export default SongPreview;
