import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import FloatingCTA from './FloatingCTA.jsx';
import SEO from './SEO.jsx';

export default function Layout() {
  return (
    <>
      <SEO />
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
