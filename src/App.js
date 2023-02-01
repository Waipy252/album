import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute"
import Home from "./Home";
import LoginForm from "./components/LoginForm";
import SigninForm from "./components/SigninForm";
import React from 'react';
import AlbumMainPage from './album/AlbumMainPage';
import { AuthProvider } from "./components/Auth"


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<Home />} />
          <Route path={`/signin/`} element={<SigninForm />} />
          <Route path={`/login/`} element={<LoginForm />} />
          <Route path={`/album/`} element={<PrivateRoute />} >
            <Route path={`/album/`} element={<AlbumMainPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;