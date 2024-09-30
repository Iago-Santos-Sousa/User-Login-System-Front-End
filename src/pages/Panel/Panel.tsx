import Header from "../../components/Header";
import { Outlet, useLocation } from "react-router-dom";

const Panel = () => {
  return (
    <div className="h-screen w-full">
      <Header />
      <Outlet />
    </div>
  );
};

export default Panel;
