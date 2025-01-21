"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./search-canvas.module.scss";

import { WindowService, Dimensions } from "@/services/window-service";
import { CanvasService } from "@/services/canvas-service";
import { SearchablesService } from "@/services/searchables-service";

const CANVAS_ID = "search-canvas";
const CANVAS_CLASS = "search-canvas";

export default function SearchCanvas() {
  const canvasRef = useRef(null);
  const [winWidth, setWinWidth] = useState(0);
  const [winHeight, setWinHeight] = useState(0);

  useEffect(() => {
    initialSetup();
  }, []);

  // Window dimensions have changed
  useEffect(() => {}, [winWidth, winHeight]);

  function initialSetup() {
    WindowService.getWindowResizeObservable().subscribe((dimensions: Dimensions) => {
      setWinWidth(dimensions.width);
      setWinHeight(dimensions.height);
    });
    if (canvasRef.current) {
      CanvasService.setCanvasElement(canvasRef.current);
      // For testing shape drawing
      SearchablesService.createSearchable();
    } else {
      // BAD
    }
  }

  return (
    <canvas
      ref={canvasRef}
      id={CANVAS_ID}
      className={styles[CANVAS_CLASS]}
      width={winWidth}
      height={winHeight}>
    </canvas>
  );
}
