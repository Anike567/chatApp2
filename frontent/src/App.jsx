import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './screen/Layout';
import Home from './screen/Home';
import Login from './screen/Login';
import ProtectedRoute from './components/ProtectedRoute';
import SocketIdContextProvider from './store/socketIdContext';
import AuthContextProvider from './store/authContext';
import Signup from './screen/Signup';
import ForgetPassword from './screen/ForgetPassword';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <SocketIdContextProvider>
          <Routes>
            <Route
              path="/"
              element={<ProtectedRoute><Layout /></ProtectedRoute>}
            >
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
            </Route>

            <Route path="login" element={<Login />} />
            <Route path="forgetpassword" element={<ForgetPassword />} />
            <Route path="signup" element={<Signup />} />
          </Routes>
        </SocketIdContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
