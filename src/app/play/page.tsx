"use client";
import { useEffect } from "react";
import Flashlight from "@/components/flashlight/flashlight";
import SearchCanvas from "@/components/search-canvas/search-canvas";
import { NavigationService } from "@/services/navigation-service";

export default function PlayPage() {
  const shouldRedirect = NavigationService.shouldRedirect()
  useEffect(() => {
    if (shouldRedirect) {
      NavigationService.redirectToHome();
      return;
    }
  }, []);

  if (shouldRedirect) {
    return null;
  }

  return (
    <main className="body-content">
      <Flashlight></Flashlight>
      <SearchCanvas></SearchCanvas>
    </main>
  );
}
