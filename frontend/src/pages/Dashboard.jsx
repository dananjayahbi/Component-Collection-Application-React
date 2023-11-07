import React, { useState, useEffect } from 'react';
import Component from '../components/SideBar'
import Header from '../components/NavBar'

function Dashboard() {
  return (
    <div>
      <Header />
      <Component />
      Dashboard
    </div>
  )
}

export default Dashboard