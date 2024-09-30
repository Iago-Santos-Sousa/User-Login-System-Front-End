import {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";

interface UserInfos {
  email: string;
  name: string;
  userId: number;
}

const userInformations: UserInfos = {
  email: "",
  name: "",
  userId: 0,
};

interface authContextValueType {
  acessToken: string;
  refreshToken: string;
  user: UserInfos;
  signIn: (
    user: UserInfos,
    newAcessToken: string,
    newRefreshToken: string,
  ) => Promise<void>;
  signOut: () => void;
  handleImgUser: (img: string) => void;
  userImg: string;
  isLoggedin: boolean;
  handleLoggedin: (loggedin: boolean) => void;
}

type AuthProviderProps = PropsWithChildren;

// Crie o contexto global da aplicação
const AppContext = createContext<authContextValueType | null>(null);

export const AppProvider = ({ children }: AuthProviderProps) => {
  const [acessToken, setAcessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfos>(userInformations);
  const [userImg, setUserImg] = useState<string>("");

  const handleImgUser = (img: string): void => {
    setUserImg(img);
  };

  const handleLoggedin = (loggedin: boolean): void => {
    setIsLoggedin(loggedin);
  };

  // Quando recarregar a aplicação inteira, irá rodar essa função
  const validateSession = async (): Promise<void> => {
    console.log("validateSession is running");
    // const result: number = await userApi().checkUser();
    const sessionToken = sessionStorage.getItem("user.acessToken");
    const sessionRefreshToken = sessionStorage.getItem("user.refreshToken");
    const sessionUser = sessionStorage.getItem("user.user");

    if (sessionToken && sessionUser && sessionRefreshToken) {
      const sessionUserParsed: UserInfos = JSON.parse(sessionUser);
      setAcessToken(sessionToken);
      setRefreshToken(sessionRefreshToken);
      setUser(sessionUserParsed);
      setIsLoggedin(true);
    }
  };

  // função para realizar login
  const signIn = async (
    user: UserInfos,
    newAcessToken: string,
    newRefreshToken: string,
  ): Promise<void> => {
    console.log("sigIn is running");
    setAcessToken(newAcessToken);
    setRefreshToken(newRefreshToken);
    setUser(user);
    setIsLoggedin(true);
    sessionStorage.setItem("user.acessToken", newAcessToken);
    sessionStorage.setItem("user.refreshToken", newRefreshToken);
    sessionStorage.setItem("user.user", JSON.stringify(user));
  };

  const signOut = (): void => {
    setAcessToken("");
    setRefreshToken("");
    setUser(userInformations);
    setUserImg("");
    setIsLoggedin(false);
    sessionStorage.clear();
  };

  useEffect(() => {
    (async () => {
      await validateSession();
    })();
  }, []);

  const authContextValue: authContextValueType = {
    acessToken,
    refreshToken,
    user,
    signIn,
    signOut,
    handleImgUser,
    userImg,
    isLoggedin,
    handleLoggedin,
  };

  // Objeto de valor que será fornecido pelo contexto
  return (
    <AppContext.Provider value={authContextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Função para usar o contexto de autenticação em outros componentes
export const useLogin = (): authContextValueType => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("useTodoContext must be used inside the TodoProvider!");
  }

  const {
    acessToken,
    refreshToken,
    user,
    signIn,
    signOut,
    handleImgUser,
    userImg,
    isLoggedin,
    handleLoggedin,
  } = appContext;

  return {
    acessToken,
    refreshToken,
    user,
    signIn,
    signOut,
    handleImgUser,
    userImg,
    isLoggedin,
    handleLoggedin,
  };
};
