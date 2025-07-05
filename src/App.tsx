import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Foods from "./pages/Foods";
import Food from "./pages/Food";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import Pendings from "./pages/Pendings";
import Pending from "./pages/Pending";
import AddFood from "./pages/AddFood";
import AddCategory from "./pages/AddCategory";
import Addbanner from "./pages/Addbanner";
import Completed from "./pages/Completed";
import Complete from "./pages/Complete";
import Banners from "./pages/Banners";
import Profile from "./pages/Profile";
import AddUser from "./pages/AddUser";
import { ToastContainer } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/login");
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) return null;
  if (!isSignedIn) return null; // avoid flash before redirect

  return <>{children}</>;
};

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route path="food" element={<Foods />} />
          <Route path="food/:id" element={<Food />} />
          <Route path="category" element={<Categories />} />
          <Route path="category/:id" element={<Category />} />
          <Route path="pending" element={<Pendings />} />
          <Route path="complete" element={<Completed />} />
          <Route path="complete/:id" element={<Complete />} />
          <Route path="pending/:id" element={<Pending />} />
          <Route path="addfood" element={<AddFood />} />
          <Route path="addcategory" element={<AddCategory />} />
          <Route path="addbanner" element={<Addbanner />} />
          <Route path="banner" element={<Banners />} />
          <Route path="profile" element={<Profile />} />
          <Route path="adduser" element={<AddUser />} />
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
