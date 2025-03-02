"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./search-canvas.module.scss";

import { WindowService, Dimensions } from "@/services/window-service";
import { CanvasService } from "@/services/canvas-service";
import { ScenarioService } from "@/services/scenario-service";
import { take } from "rxjs";

const CANVAS_CONTAINER_ID = "canvas-container";
const CANVAS_CONTAINER_CLASS = "canvas-container";
const CANVAS_ID = "search-canvas";
const CANVAS_CLASS = "search-canvas";
const BACKGROUND_CANVAS_ID = "background-canvas";
const BACKGROUND_CANVAS_CLASS = "background-canvas";

export default function SearchCanvas() {
  const backgroundCanvasRef = useRef(null);
  const findablesCanvasRef = useRef(null);
  const [winWidth, setWinWidth] = useState(0);
  const [winHeight, setWinHeight] = useState(0);

  useEffect(() => {
    initialSetup();
  }, []);

  // Window dimensions have changed
  // useEffect(() => { }, [winWidth, winHeight]);

  async function initialSetup() {
    WindowService.getWindowResizeObservable()
      .pipe(take(1))
      .subscribe((dimensions: Dimensions) => {
        setWinWidth(dimensions.width);
        setWinHeight(dimensions.height);
      });
    if (findablesCanvasRef.current) {
      CanvasService.setCanvasElement(findablesCanvasRef.current);
    }
    if (backgroundCanvasRef.current) {
      CanvasService.setBackgroundCanvasElement(backgroundCanvasRef.current);
    }
    await ScenarioService.loadScenario('fruit');
  }

  return (
    <div id={CANVAS_CONTAINER_ID} className={styles[CANVAS_CONTAINER_CLASS]}>
      <canvas
        ref={backgroundCanvasRef}
        id={BACKGROUND_CANVAS_ID}
        className={styles[BACKGROUND_CANVAS_CLASS]}
        width={winWidth}
        height={winHeight}>
      </canvas>
      <canvas
        ref={findablesCanvasRef}
        id={CANVAS_ID}
        className={styles[CANVAS_CLASS]}
        width={winWidth}
        height={winHeight}>
      </canvas>
    </div>
  );
}
