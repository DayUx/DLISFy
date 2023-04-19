import { useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";
import {
  AimOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
  OrderedListOutlined,
  TeamOutlined,
  FlagOutlined,
  PlusOutlined,
  HomeOutlined,
  SearchOutlined,
  BookOutlined,
} from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  Layout,
  Menu,
  Space,
  Switch,
  theme,
  Typography,
} from "antd";
import Timer from "./components/player/timer/Timer.jsx";
import Player from "./components/player/Player.jsx";
import { useNavigate } from "react-router-dom";

const { Header, Footer, Sider, Content } = Layout;
const { defaultAlgorithm, darkAlgorithm } = theme;
const { Text } = Typography;
function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("0");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const items = [
    {
      key: "0",
      url: "/",
      icon: <HomeOutlined />,
      label: "Accueil",
    },
    {
      key: "1",
      url: "rechercher",
      icon: <SearchOutlined />,
      label: "Rechercher",
    },
    {
      key: "2",
      url: "bibliotheque",
      icon: <BookOutlined />,
      label: "Bibliothèque",
    },
  ];
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
              <Content>
                <div
                  className="logo"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img width={"80%"} alt={"logo"} src={logo} />
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
            <Content></Content>
          </Layout>
        </Layout>
        <Footer
          style={{
            padding: "10px 20px",
          }}
        >
          <Player></Player>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
