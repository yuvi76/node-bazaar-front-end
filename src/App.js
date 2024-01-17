import Home from "./pages/Home";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./App.css";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import CategoryPage from "./pages/CategoryPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductContextProvider from "./contexts/ProductContext";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProductContextProvider>
        <Home></Home>
      </ProductContextProvider>
    ),
  },
  {
    path: "/product/:id",
    element: <ProductDetailsPage></ProductDetailsPage>,
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <ProfilePage></ProfilePage>,
      </PrivateRoute>
    ),
  },
  {
    path: "/category",
    element: (
      <ProductContextProvider>
        <CategoryPage></CategoryPage>
      </ProductContextProvider>
    ),
  },
]);

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
