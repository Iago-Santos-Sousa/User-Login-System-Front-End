import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// Crie uma instância do Axios com a URL base
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Adicione um interceptor de requisição
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const acessToken: string | null = sessionStorage.getItem("user.acessToken");
  const pathUrlValue: string = window.location.pathname;

  if (acessToken && !pathUrlValue.includes("/reset-password")) {
    config.headers.Authorization = `Bearer ${acessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  function (response: AxiosResponse) {
    return response;
  },
  async function (error: AxiosError) {
    const originalRequest: InternalAxiosRequestConfig | undefined =
      error.config;

    if (error.response?.status === 403) {
      const refreshToken: string | null =
        sessionStorage.getItem("user.refreshToken");

      if (refreshToken) {
        try {
          // Requisição para gerar um novo acessToken
          const response: AxiosResponse = await api.post("/refresh-token", {
            refreshToken,
          });

          // Coloca o novo acessToken e refreshToken no localStorage
          sessionStorage.setItem("user.acessToken", response.data.acessToken);
          sessionStorage.setItem(
            "user.refreshToken",
            response.data.refreshToken,
          );

          if (originalRequest) {
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return api(originalRequest);
          } else {
            throw new Error("Error in refresh-token requisition!");
          }
        } catch (error: unknown | AxiosError) {
          console.log(error);
          sessionStorage.clear();
          window.location.replace("/");
        }
      } else {
        sessionStorage.clear();
        window.location.replace("/");
      }
    }

    // Redirecionar para a tela de login caso o acessToken não seja mais válido
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
      sessionStorage.clear();
    }
    return Promise.reject(error);
  },
);

export default api;
