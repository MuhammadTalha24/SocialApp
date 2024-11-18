import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.scss'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Feeds from './pages/Feeds.jsx'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/login' element={<Login />} ></Route>
        <Route path='/' element={<Feeds />}></Route>
      </Routes>

    </>
  )
}

export default App