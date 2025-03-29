import AppRouter from "./AppRouter";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <div>
      <AppRouter />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}

export default App;
