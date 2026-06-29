import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Masters from './components/Masters';
import Reviews from './components/Reviews';
import Contacts from './components/Contacts';
import Footer from './components/Footer';
import { useActiveSection } from './hooks/useActiveSection';

export default function App() {
  const activeSection = useActiveSection();

  return (
    <>
      <Header activeSection={activeSection} />
      <main>
        <Hero />
        <About />
        <Services />
        <Masters />
        <Reviews />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
