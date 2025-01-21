"use client";

import React, { useEffect, useState } from "react";
import styles from "./search-canvas.module.scss";

const CANVAS_ID = "search-canvas";
const CANVAS_CLASS = "search-canvas";

export default function SearchCanvas() {
  const [winWidth, setWinWidth] = useState(0);
  const [winHeight, setWinHeight] = useState(0);

  useEffect(() => {
    initialSetup();
  }, []);

  function initialSetup() {
    setWinWidth(window.innerWidth);
    setWinHeight(window.innerHeight);
  }

  return (
    <canvas
      id={CANVAS_ID}
      className={styles[CANVAS_CLASS]}
      width={winWidth}
      height={winHeight}>
    </canvas>
  );
}
