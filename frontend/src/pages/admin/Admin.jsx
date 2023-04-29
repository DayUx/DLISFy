import React, { useEffect, useState } from "react";
import {
  HomeFilled,
  HomeOutlined,
  LockOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Layout,
  Typography,
  Space,
  notification,
  Menu,
  Switch,
  ConfigProvider,
  theme,
} from "antd";
import { Route, Routes, useNavigate } from "react-router-dom";
import { API } from "../../utils/API.jsx";
import logo from "../../assets/logo.svg";
import Bibliotheque from "../bibliotheque/Bibliotheque.jsx";
import Likes from "../likes/Likes.jsx";
import Rechercher from "../rechercher/Rechercher.jsx";
import Accueil from "../accueil/Accueil.jsx";
import Player from "../../components/player/Player.jsx";
import ArtistesCRUD from "../crud/ArtistesCRUD/ArtistesCRUD.jsx";
import MusiquesCRUD from "../crud/MusiquesCRUD/MusiquesCRUD.jsx";
import StylesCRUD from "../crud/StylesCRUD/StylesCRUD.jsx";
import { get } from "../../utils/CustomRequests.jsx";
import AlbumsCRUD from "../crud/AlbumsCRUD/AlbumsCRUD.jsx";

const { Sider, Header, Content, Footer } = Layout;
const { Text, Title, Link } = Typography;
const { defaultAlgorithm, darkAlgorithm } = theme;

const Admin = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("0");
  const items = [
    {
      key: "0",
      url: "/admin/artistes",
      label: "Artistes",
    },
    {
      key: "1",
      url: "/admin/albums",
      label: "Albums",
    },
    {
      key: "2",
      url: "/admin/musiques",
      label: "Musiques",
    },
    {
      key: "3",
      url: "/admin/styles",
      label: "Styles",
    },
  ];
  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
    }
    get(API.admin);
  }, []);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <Layout style={{ height: "100vh" }}>
        <Layout style={{ height: "100%" }}>
          <Sider
            theme={isDarkMode ? "dark" : "light"}
            trigger={null}
            collapsible
            collapsed={collapsed}
          >
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "1rem",
              }}
            >
              <Content
                style={{
                  width: "100%",
                }}
              >
                <div
                  className="logo"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Title level={3}>Admin</Title>
                </div>
                <Menu
                  theme={isDarkMode ? "dark" : "light"}
                  mode="inline"
                  defaultSelectedKeys={["1"]}
                  selectedKeys={[selectedKey]}
                  onSelect={(e) => (
                    setSelectedKey(e.key), navigate(e.item.props.url)
                  )}
                  items={items}
                />
              </Content>
              <Space
                style={{
                  margin: "auto 0 0 0",
                }}
              >
                <Switch
                  checked={isDarkMode}
                  onChange={() => setIsDarkMode(!isDarkMode)}
                  title={isDarkMode ? "Mode clair" : "Mode sombre"}
                />

                <Text strong>Mode sombre</Text>
              </Space>
            </div>
          </Sider>
          <Layout className="site-layout">
            <Content>
              <Routes>
                <Route path="/albums" element={<AlbumsCRUD />} />
                <Route path="/artistes" element={<ArtistesCRUD />} />
                <Route path="/" element={<ArtistesCRUD />} />
                <Route path="/musiques" element={<MusiquesCRUD />} />
                <Route path="/styles" element={<StylesCRUD />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default Admin;
