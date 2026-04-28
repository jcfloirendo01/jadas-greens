import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import StatsStrip from "@/components/StatsStrip";
import Varieties from "@/components/Varieties";
import PricingBlock from "@/components/PricingBlock";
import Process from "@/components/Process";
import Delivery from "@/components/Delivery";
import OrderCTA from "@/components/OrderCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <StatsStrip />
      <Varieties />
      <PricingBlock />
      <Process />
      <Delivery />
      <OrderCTA />
      <Footer />
    </>
  );
}
