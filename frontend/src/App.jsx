import React ,{lazy}from 'react'
import './App.css'
import {Outlet, Route,Routes} from 'react-router-dom' 
import Navbar from './components/Navbar';
import Login from './components/Login';
import { Toaster } from 'react-hot-toast';

const Home = lazy(() => import("./pages/Home"));
const Layout= lazy(() => import("./pages/Layout"));
const CementPlantRegister= lazy(() => import("./pages/RegisterCementPlant"));
const CementPlant= lazy(() => import("./pages/CementPlant"));
const Scenario=lazy(()=>import( './pages/Scenario'));
const Dashboard=lazy(()=>import( './pages/Dashboard'));
import { SocketProvider } from './utils/socket';
function App() {

  return (
    <>
    <Navbar />
    <Toaster/>
     <Routes>

      
        <Route path='/' element={<Layout/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/register-cement-plant' element={<CementPlantRegister/>}/>
        <Route path='/cement-plant' element={<CementPlant/>}/>
        <Route path='/login-cement-plant' element={<Login/>}/>
        <Route path='/scenario' element={<Scenario/>}/>
         <Route
            element={
              <SocketProvider>
                <Outlet/>
              </SocketProvider>
            }
          >
        <Route path='/dashboard' element={<Dashboard/>}/>
         </Route>
    
     </Routes>
    </>
    
  )
}

export default App
