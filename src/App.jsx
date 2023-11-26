import './App.css'
import {useCallback, useState} from 'react'
import Footer from './components/Footer'
import { Route, Routes } from 'react-router-dom'
import NavBar from './components/Navbar'
import Home from './pages/Home'
import WorkSpace1 from './components/WorkSpace1'
import WorkSpace2 from './components/WorkSpace2'
import WorkSpace3 from './components/WorkSpace3'

function App() {
  const [hideSourceOnDrag, setHideSourceOnDrag] = useState(true);
  const toggle = useCallback(() => setHideSourceOnDrag(!hideSourceOnDrag), [
    hideSourceOnDrag
  ]);

  return (
    <>
      <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workspace1" element={<WorkSpace1 hideSourceOnDrag={hideSourceOnDrag}/>} />
          <Route path="/workspace2" element={<WorkSpace2 hideSourceOnDrag={hideSourceOnDrag}/>} />
          <Route path="/workspace3" element={<WorkSpace3 hideSourceOnDrag={hideSourceOnDrag}/>} />
        </Routes>
      <Footer />
    </>
  )
}

export default App
