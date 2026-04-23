"use client";

import React from "react";
import {
  NavigationService,
  Routes,
} from "@/services/navigation-service";
import styles from "./home-main.module.scss";

export default function HomeMain() {
  function onPlayButtonClick() {
    NavigationService.setRedirect(false);
    NavigationService.navigateToRoute(Routes.PLAY);
  }

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <button type="button" onClick={onPlayButtonClick}>
          Play
        </button>
      </div>
    </main >
  );
}
