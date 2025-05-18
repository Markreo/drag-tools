import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Home, Project} from "./pages";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/project/:projectId" element={<Project />} />
            </Routes>
        </Router>
    );
}
