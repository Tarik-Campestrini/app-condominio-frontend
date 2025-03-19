// Importando 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RoutesApp from './routes'
import { AuthProvider } from "./contexts/AuthContext/auth";
import "./global.css"



createRoot(document.getElementById('root')).render(
  
  <AuthProvider>

    <RoutesApp />
    
  </AuthProvider>
 
)
