import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './stylesheets/App.css'
import { AuthProvider } from "./components/contexts/authContext/authentication";
import AppContainer from "./components/AppContainer/AppContainer";

// import React, { useEffect, useState } from "react";
// import axios from "axios";


function App() {

  return (
   <div>
    <AuthProvider>
      <AppContainer />
    </AuthProvider>
   </div>
  )
}

export default App
