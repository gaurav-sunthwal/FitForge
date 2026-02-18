import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureHighlights from "./components/FeatureHighlights";
import CustomizedWorkouts from "./components/CustomizedWorkouts";
import WorkoutOptions from "./components/WorkoutOptions";
import HealthStrength from "./components/HealthStrength";
import Footer from "./components/Footer";

import { Reveal } from "./components/Reveal";

import CaloriesFeature from "./components/CaloriesFeature";
import AnalyticsFeature from "./components/AnalyticsFeature";
import AICoachFeature from "./components/AICoachFeature";
import DownloadSection from "./components/DownloadSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Navbar />
      <Hero />
      <div id="features">
        <CaloriesFeature />
        <AnalyticsFeature />
        <AICoachFeature />
      </div>
      <Reveal>
        <div id="scheduling">
          <CustomizedWorkouts />
        </div>
      </Reveal>
      <Reveal>
        <FeatureHighlights />
      </Reveal>
      <Reveal>
        <div id="workouts">
          <WorkoutOptions />
        </div>
      </Reveal>
      <DownloadSection />
      <Footer />
    </main>
  );
}
