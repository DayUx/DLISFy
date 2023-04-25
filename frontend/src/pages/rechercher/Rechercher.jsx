import {
  Button,
  Card,
  Image,
  Input,
  Layout,
  Segmented,
  Space,
  Typography,
} from "antd";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import { get } from "../../utils/CustomRequests.jsx";
import { API } from "../../utils/API.jsx";
import { publish, subscribe } from "../../utils/events.jsx";
import Songs from "../../components/songs/Songs.jsx";
import Artists from "../../components/artists/Artists.jsx";
import { utils } from "../../utils/_helper.jsx";
import { useLocation } from "react-router-dom";
import Styles from "../../components/styles/Styles.jsx";
const { Text, Title, Link } = Typography;
const { Content } = Layout;
const { Search } = Input;

const Rechercher = forwardRef(({ playMusic = function () {} }, ref) => {
  const [musiques, setMusiques] = useState([]);
  const [artistes, setArtistes] = useState([]);
  const [styles, setStyles] = useState([]);
  const [filter, setFilter] = useState("Tout");
  const searchRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    onSearch(".*");

    console.log("location", location);
  }, []);
  const onSearch = (value) => {
    if (!value) {
      value = ".*";
    }
    get(API.searchMusiques + "/" + value, {
      success: (data) => {
        setMusiques(data);
      },
    });
    get(API.searchArtistes + "/" + value, {
      success: (data) => {
        setArtistes(data);
      },
    });
    get(API.searchStyles + "/" + value, {
      success: (data) => {
        setStyles(data);
      },
    });
  };

  return (
    <Layout
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <Space
        direction={"vertical"}
        style={{
          padding: "30px 30px 10px 30px",
        }}
      >
        <Search ref={searchRef} onSearch={onSearch}></Search>
        <Segmented
          value={filter}
          onChange={(value) => {
            console.log(value);
            setFilter(value);
          }}
          options={["Tout", "Titres", "Artistes", "Albums", "Genres"]}
        />
      </Space>
      <Space
        direction={"vertical"}
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
          overflowY: "scroll",
          padding: "0 30px 0 30px",
        }}
      >
        {(filter === "Tout" || filter === "Titres") && musiques?.length > 0 ? (
          <Songs songs={musiques} />
        ) : null}
        {(filter === "Tout" || filter === "Artistes") &&
        artistes?.length > 0 ? (
          <Artists artists={artistes} />
        ) : null}
        {(filter === "Tout" || filter === "Genres") && styles?.length > 0 ? (
          <Styles styles={styles} />
        ) : null}
      </Space>
    </Layout>
  );
});
export default Rechercher;
