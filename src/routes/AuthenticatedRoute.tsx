import React, { useEffect, PropsWithChildren } from "react";
import { useLogin } from "../context/AppProvider";
import { useNavigate } from "react-router-dom";

const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const acessToken = useLogin()?.acessToken;
  const user = useLogin()?.user;
  const refreshToken = useLogin()?.refreshToken;
  const isLoggedin = useLogin()?.isLoggedin;
  // const handleLoggedin = useLogin()!.handleLoggedin;
  const navigate = useNavigate();

  useEffect(() => {
    const sessionToken = sessionStorage.getItem("user.acessToken");
    const sessionUser = sessionStorage.getItem("user.user");
    const sessionRefreshToken = sessionStorage.getItem("user.refreshToken");

    if (!sessionToken || !sessionUser || !sessionRefreshToken) {
      sessionStorage.clear();
      return navigate("/", { replace: true });
    }
  }, []);

  if (!acessToken) {
    return <div>Carregando...</div>;
  } else {
    return children;
  }
};

export default AuthenticatedRoute;
