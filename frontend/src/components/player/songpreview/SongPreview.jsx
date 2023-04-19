import { Image, Layout, Row, Space, Typography } from "antd";

const { Text } = Typography;
const SongPreview = ({ song }) => {
  return (
    <Space align={"center"}>
      <Image height={50} preview={false} src={song?.image}></Image>
      <Layout>
        <Text strong>{song?.title}</Text>
        <Text
          style={{
            opacity: 0.8,
          }}
        >
          {song?.artist}
        </Text>
      </Layout>
    </Space>
  );
};

export default SongPreview;
