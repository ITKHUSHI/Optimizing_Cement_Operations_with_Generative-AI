import React ,{lazy}from 'react'
import './App.css'
import {Route,Routes} from 'react-router-dom' 
import Navbar from './components/Navbar';

const Home = lazy(() => import("./pages/home"));
const Profile = lazy(() => import("./pages/profile"));

function App() {

  return (
    <>
    <Navbar />
     <Routes>
      
        <Route path='/home' element={<Home/>}/>
        <Route path='/profile' element={<Profile/>}/>

    
     </Routes>
    </>
    
  )
}

export default App
