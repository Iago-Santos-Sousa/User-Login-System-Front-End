import AllRoutes from "./routes";
import { AppProvider } from "./context/AppProvider";

function App() {
  return (
    <>
      <AppProvider>
        <AllRoutes />
      </AppProvider>
    </>
  );
}

export default App;
