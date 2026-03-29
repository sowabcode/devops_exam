import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LayoutProvider } from "./contexts/LayoutContext";

import MainApp from "./routes/MainApp";

import Login from "./pages/Login";
import Livres from "./pages/Livres";
import Emprunts from "./pages/Emprunts";
import Utilisateurs from "./pages/Utilisateurs";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<MainApp />}>
              <Route path="/livres" element={<Livres />} />
              <Route path="/emprunts" element={<Emprunts />} />
              <Route path="/utilisateurs" element={<Utilisateurs />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LayoutProvider>
    </QueryClientProvider>
  );
}

export default App;
