import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureHighlights from "./components/FeatureHighlights";
import CustomizedWorkouts from "./components/CustomizedWorkouts";
import WorkoutOptions from "./components/WorkoutOptions";
import HealthStrength from "./components/HealthStrength";
import Footer from "./components/Footer";

import { Reveal } from "./components/Reveal";

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Navbar />
      <Hero />
      <Reveal>
        <FeatureHighlights />
      </Reveal>
      <Reveal>
        <CustomizedWorkouts />
      </Reveal>
      <Reveal>
        <WorkoutOptions />
      </Reveal>
      <Reveal>
        <HealthStrength />
      </Reveal>
      <Footer />
    </main>
  );
}
