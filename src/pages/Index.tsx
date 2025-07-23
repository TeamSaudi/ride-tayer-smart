import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

const Index = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        window.scrollBy({ top: 100, behavior: "smooth" });
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        window.scrollBy({ top: -100, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
    </div>
  );
};

export default Index;
