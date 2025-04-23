import React from "react";
import Navbar from "../Pages/Navbar";
import Hero from "../Pages/Hero";
import Feature from "../Pages/Feature";
import Translator from "../Pages/Translator";
import Footer from "../Pages/Footer";
const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 animate-gradient">
      <Navbar />
      <main className="flex-grow">
      <Hero />
      <Feature />
      <Translator />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
