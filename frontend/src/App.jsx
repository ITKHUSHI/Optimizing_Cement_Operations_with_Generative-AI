import React ,{lazy}from 'react'
import './App.css'
import {Route,Routes} from 'react-router-dom' 
import Navbar from './components/Navbar';
import Login from './components/Login';

const Home = lazy(() => import("./pages/home"));
// const Profile = lazy(() => import("./pages/profile"));
const Layout= lazy(() => import("./pages/layout"));
const CementPlantRegister= lazy(() => import("./pages/RegisterCementPlant"));
const CementPlant= lazy(() => import("./pages/cementPlant"));
const Scenario=lazy(()=>import( './pages/Scenario'));
const Dashboard=lazy(()=>import( './pages/Dashboard'));
function App() {

  return (
    <>
    <Navbar />
     <Routes>
      
        <Route path='/' element={<Layout/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/register-cement-plant' element={<CementPlantRegister/>}/>
        <Route path='/cement-plant' element={<CementPlant/>}/>
        <Route path='/login-cement-plant' element={<Login/>}/>
        <Route path='/scenario' element={<Scenario/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>

    
     </Routes>
    </>
    
  )
}

export default App
