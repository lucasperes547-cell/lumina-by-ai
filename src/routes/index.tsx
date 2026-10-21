import { pageHead } from "@/lib/page-head";
import { createFileRoute } from "@tanstack/react-router";
import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingFooter } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => pageHead('Aprenda do seu jeito', 'Lumina AI: estudos personalizados, tutor e exercícios para estudantes brasileiros.'),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <Hero />
      <Features />
      <HowItWorks />
      <LandingFooter />
    </div>
  );
}
