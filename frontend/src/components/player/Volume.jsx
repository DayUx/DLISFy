import { useEffect, useState } from "react";
import { BsVolumeDown, BsVolumeMute, BsVolumeUp } from "react-icons/bs";
import { Layout, Slider } from "antd";

const { Content } = Layout;

const Volume = ({ onChange = function () {}, volume }) => {
  const icon = () => {
    let IconTag;
    switch (volume) {
      case 0:
        IconTag = BsVolumeMute;
        break;
      case 100:
        IconTag = BsVolumeUp;
        break;
      default:
        IconTag = BsVolumeDown;
        break;
    }
    return (
      <IconTag
        onClick={() => {
          if (volume === 0) {
            onChange(100);
            return;
          }
          onChange(0);
        }}
        size={25}
      />
    );
  };

  return (
    <Content
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {icon()}

      <Slider value={volume} onChange={onChange} style={{ flex: 1 }}></Slider>
    </Content>
  );
};
export default Volume;
