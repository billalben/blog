import { Outlet, Link, useNavigate } from "react-router-dom";
import { Layout as AntLayout, Button, Dropdown, Space, Typography } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  PlusOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { useAuth } from "@/app/providers/use-auth";

const { Header, Content } = AntLayout;

export const AppLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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
        }}
      >
        <Space size="large">
          <Link
            to="/blogs"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <Typography.Title level={4} style={{ margin: 0, color: "inherit" }}>
              Blog
            </Typography.Title>
          </Link>
        </Space>

        <Space>
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
                <Button type="text" icon={<UserOutlined />}>
                  {user?.username}
                </Button>
              </Dropdown>
            </>
          ) : (
            <Space>
              <Button type="text" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button type="primary" onClick={() => navigate("/register")}>
                Register
              </Button>
            </Space>
          )}
        </Space>
      </Header>

      <Content
        style={{
          padding: "24px",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Outlet />
      </Content>
    </AntLayout>
  );
};
