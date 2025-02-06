"use client";

import { useEffect } from "react";

import styles from "./page.module.scss";
import Flashlight from "./components/flashlight/flashlight";
import SearchCanvas from "./components/search-canvas/search-canvas";

import { MouseMoveService } from "./services/mouse-move-service";
import { WindowService } from "./services/window-service";

export default function Home() {
  useEffect(() => {
    WindowService.registerListeners();
    MouseMoveService.registerListeners();

    return () => {
      WindowService.removeListeners();
      MouseMoveService.removeListeners();
    };
  }, []);
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Flashlight></Flashlight>
        <SearchCanvas></SearchCanvas>
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
