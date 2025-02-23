import React from 'react'
import Navbar from './components/LandingPage/Navbar'
import Hero from './components/LandingPage/Hero'
import About from './components/LandingPage/About'
import Gallery from './components/LandingPage/Gallery'
import Contact from './components/LandingPage/Contact'
import Footer from './components/LandingPage/Footer'

function Home() {
  return (
    <>
    <Navbar />
    <Hero />
    <About />
    <Gallery />
    <Contact />
    <Footer />
    </>
  )
}

export default Home