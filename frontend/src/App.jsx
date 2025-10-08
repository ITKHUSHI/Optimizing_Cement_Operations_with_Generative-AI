import React ,{lazy}from 'react'
import './App.css'
import {Outlet, Route,Routes} from 'react-router-dom' 
import Navbar from './components/Navbar';
import Login from './components/Login';
import { Toaster } from 'react-hot-toast';

const PredictEnergy= lazy(() => import("./pages/PredictEnergy"));
const Layout= lazy(() => import("./pages/Layout"));
const CementPlantRegister= lazy(() => import("./pages/RegisterCementPlant"));
const CementPlant= lazy(() => import("./pages/CementPlant"));
const Scenario=lazy(()=>import( './pages/Scenario'));
const Dashboard=lazy(()=>import( './pages/Dashboard'));
const HistoricalData=lazy(()=>import( './pages/HistoricalData'));
import { SocketProvider } from './utils/socket';
import Footer from './components/Footer';
function App() {

  return (
    <>
    <Navbar />
    <Toaster/>
     <Routes>

      
        <Route path='/' element={<Layout/>}/>
        <Route path='/pridict-energy' element={<PredictEnergy/>}/>
        <Route path='/register-cement-plant' element={<CementPlantRegister/>}/>
        <Route path='/cement-plant' element={<CementPlant/>}/>
        <Route path='/login-cement-plant' element={<Login/>}/>
        <Route path='/scenario' element={<Scenario/>}/>
        <Route path='/historical-data' element={<HistoricalData/>}/>
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

     <Footer/>
    </>
    
  )
}

export default App
