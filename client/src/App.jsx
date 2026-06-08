import { Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <>
     <Routes>
      <Route path="/" element={<RegisterPage />} />
      <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
      {/* <Route path="/" element={<RegisterPage />} /> */}
        <Route path="/login" element={<LoginPage></LoginPage>}></Route>
        <Route
path="/chat"
element={
<ProtectedRoute>
<ChatPage/>
</ProtectedRoute>
}
/>
<Route path="*" element={<h1 style={ {color: "red", margin: "50px auto"}}>Page Not Exist</h1>}></Route>
     </Routes>
    </>
  )
}

export default App
