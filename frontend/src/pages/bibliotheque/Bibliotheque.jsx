import { Layout, Segmented, Space, Typography } from "antd";
import Songs from "../../components/songs/Songs.jsx";
import Artists from "../../components/artists/Artists.jsx";
import Albums from "../../components/albums/Albums.jsx";
import Styles from "../../components/styles/Styles.jsx";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { get } from "../../utils/CustomRequests.jsx";
import { API } from "../../utils/API.jsx";
const { Text, Title, Link } = Typography;
const Bibliotheque = () => {
  const [musiques, setMusiques] = useState([]);
  const [artistes, setArtistes] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [styles, setStyles] = useState([]);
  const [filter, setFilter] = useState("Titres");
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
    get(API.searchAlbums + "/" + value, {
      success: (data) => {
        setAlbums(data);
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
        <Segmented
          value={filter}
          onChange={(value) => {
            console.log(value);
            setFilter(value);
          }}
          options={["Titres", "Artistes", "Albums", "Genres"]}
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
        {filter === "Titres" && musiques?.length > 0 ? (
          <Songs showAll={true} songs={musiques} />
        ) : null}
        {filter === "Artistes" && artistes?.length > 0 ? (
          <Artists showAll={true} artists={artistes} />
        ) : null}
        {filter === "Albums" && albums?.length > 0 ? (
          <Albums showAll={true} albums={albums} />
        ) : null}
        {filter === "Genres" && styles?.length > 0 ? (
          <Styles showAll={true} styles={styles} />
        ) : null}
      </Space>
    </Layout>
  );
};
export default Bibliotheque;
