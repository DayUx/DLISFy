import { Image, Layout, Row, Space, Typography } from "antd";
import { useEffect } from "react";
import ArtistLink from "../../link/ArtistLink.jsx";

const { Text } = Typography;
const SongPreview = ({ song }) => {
  useEffect(() => {}, [song]);
  return (
    <Space align={"center"}>
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
      <Layout>
        <Text strong>{song?.title}</Text>
        <Text
          style={{
            opacity: 0.8,
          }}
        >
          {song?.artists?.map((artiste) => {
            return <ArtistLink id={artiste}></ArtistLink>;
          })}
        </Text>
      </Layout>
    </Space>
  );
};

export default SongPreview;
