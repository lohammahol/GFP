import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/Login";
import Principal from "./pages/Principal";

export default function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Principal" element={<Principal />}/>
      </Routes>
    </Router>
  )
}
