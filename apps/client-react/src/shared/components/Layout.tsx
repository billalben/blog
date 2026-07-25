import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  Layout as AntLayout,
  Button,
  Dropdown,
  Flex,
  Space,
  Typography,
  theme,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  PlusOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { useAuth } from "@/app/providers/use-auth";
import { useTheme } from "@/app/providers/use-theme";

const { Header, Content } = AntLayout;

export const AppLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <SettingOutlined />,
      label: "Profile",
      onClick: () => navigate("/profile"),
    },
    ...(user?.role === "admin"
      ? [
          {
            key: "admin-users",
            icon: <TeamOutlined />,
            label: "Users",
            onClick: () => navigate("/admin/users"),
          },
        ]
      : []),
    { type: "divider" as const },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: 24,
          background: isDark ? "#141414" : "#001529",
          borderBottom: isDark ? `1px solid ${token.colorSplit}` : "none",
          color: "#fff",
        }}
      >
        <Space size="large">
          <Link to="/blogs" style={{ textDecoration: "none" }}>
            <Typography.Title level={4} style={{ margin: 0, color: "#fff" }}>
              Blog
            </Typography.Title>
          </Link>
        </Space>

        <Flex align="center" gap={8}>
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              {user?.role === "admin" && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/blogs/new")}
                >
                  New Post
                </Button>
              )}
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Button
                  type="text"
                  icon={<UserOutlined />}
                  style={{ color: "#fff" }}
                >
                  {user?.username}
                </Button>
              </Dropdown>
            </>
          ) : (
            <Space align="center">
              <Button
                type="text"
                onClick={() => navigate("/login")}
                style={{ color: "#fff" }}
              >
                Login
              </Button>
              <Button type="primary" onClick={() => navigate("/register")}>
                Register
              </Button>
            </Space>
          )}
        </Flex>
      </Header>

      <Content
        style={{
          padding: "24px",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Content>
    </AntLayout>
  );
};
