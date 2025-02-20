"use client";
import AppFooter from "@/components/app-footer/app-footer";
import AppHeader from "@/components/app-header/app-header";
import { 
  NavigationService,
  Routes,
} from "@/services/navigation-service";
import styles from "@/page.module.scss";
import '@globals';

export default function HomePage() {
  function onPlayButtonClick() {
    NavigationService.setRedirect(false);
    NavigationService.navigateToRoute(Routes.PLAY);
  }

  return (
    <div className="body-content">
      <AppHeader></AppHeader>
      <main>
        <button type="button" onClick={onPlayButtonClick}>
          Play
        </button>
      </main>
      <AppFooter></AppFooter>
    </div>
  );
}
