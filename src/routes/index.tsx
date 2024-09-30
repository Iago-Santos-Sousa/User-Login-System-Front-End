import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";
import Home from "../pages/Home/Home";
import Panel from "../pages/Panel/Panel";
import Error404 from "../pages/Error404/Error404";
import CreateUser from "../pages/CreateUser/CreateUser";
import UserDetails from "../pages/UserDetails/UserDetails";
import AuthenticatedRoute from "./AuthenticatedRoute";
import ProfileCard from "../pages/ProfileCard/ProfileCard";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";

interface AboutPageProps extends RouteComponentProps {}

const AllRoutes: React.FC<AboutPageProps> = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="create-user" element={<CreateUser />} />
        <Route path="reset-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route
          path="panel"
          element={
            <AuthenticatedRoute>
              <Panel />
            </AuthenticatedRoute>
          }
        >
          <Route index element={<ProfileCard />} />
          <Route path="user-details/:userId" element={<UserDetails />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
};

export default AllRoutes;
