import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./account/LoginPage";
import Home from "./base/HomePage";
import NotFound from "./base/NotFound";
import Layout from "./components/Layout";
import Register from "./account/RegisterPage";
import StoryExpander from "./function/StoryExpander";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/register" element={<Register />} />
          <Route path="/story-expander" element={<StoryExpander />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
