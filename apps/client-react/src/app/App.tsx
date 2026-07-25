import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/app/providers/Theme.provider";
import { QueryProvider } from "@/app/providers/Query.provider";
import { AuthProvider } from "@/app/providers/Auth.provider";
import { router } from "@/app/router/router";

const App = () => (
  <ThemeProvider>
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryProvider>
  </ThemeProvider>
);

export default App;
