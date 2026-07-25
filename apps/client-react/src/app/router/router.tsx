import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/shared/components/Layout";
import { ProtectedRoute } from "@/app/router/ProtectedRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { ProfilePage } from "@/features/users/pages/ProfilePage";
import { AdminUsersPage } from "@/features/users/pages/AdminUsersPage";
import { BlogsListPage } from "@/features/blogs/pages/BlogsListPage";
import { BlogDetailPage } from "@/features/blogs/pages/BlogDetailPage";
import { BlogFormPage } from "@/features/blogs/pages/BlogFormPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/blogs" replace /> },
      {
        element: <ProtectedRoute guestOnly />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "blogs", element: <BlogsListPage /> },
          { path: "blogs/:slug", element: <BlogDetailPage /> },
          { path: "profile", element: <ProfilePage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <ProtectedRoute roles={["admin"]} />,
            children: [
              { path: "blogs/new", element: <BlogFormPage /> },
              { path: "blogs/:slug/edit", element: <BlogFormPage /> },
              { path: "admin/users", element: <AdminUsersPage /> },
            ],
          },
        ],
      },
      { path: "*", element: <Navigate to="/blogs" replace /> },
    ],
  },
]);
