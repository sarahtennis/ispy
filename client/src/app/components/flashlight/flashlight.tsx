"use client";

import React, { useEffect, useState } from "react";
import styles from "./flashlight.module.scss";

const MOVED_STOPPED_TIMEOUT_MS = 100;
const SHRINK_INTERVAL_MS = 15;
const GROW_INTERVAL_MS = 5;
const CIRCLE_MAX_RADIUS = 150;
const CIRCLE_MIN_RADIUS = 125;

export default function Flashlight() {
  const [moveTimeout, setMoveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [shrinkInterval, setShrinkInterval] = useState<NodeJS.Timeout | null>(null);
  const [growInterval, setGrowInterval] = useState<NodeJS.Timeout | null>(null);
  const [circleRadius, setCircleRadius] = useState(150);
  const [viewCx, setViewCx] = useState(0);
  const [viewCy, setViewCy] = useState(0);
  const [winWidth, setWinWidth] = useState(0);
  const [winHeight, setWinHeight] = useState(0);

  useEffect(() => {
    initialSetup();

    // return teardown;
  }, []);

  useEffect(() => {
    if (!moveTimeout) {
      startMove();
    } else {
      restartMoveTimeout();
    }
  }, [viewCx, viewCy]);

  // Init
  function initialSetup() {
    setWinWidth(window.innerWidth);
    setWinHeight(window.innerHeight);
  }

  function startMove() {
    shrink();
    startNewTimeout();
  }

  function restartMoveTimeout() {
    if (moveTimeout) {
      clearTimeout(moveTimeout);
    }
    startNewTimeout();
  }

  function shrink() {
    if (growInterval) {
      clearInterval(growInterval);
      setGrowInterval(null);
    }

    if (!shrinkInterval) {
      const shrinkInt = setInterval(shrinkAction, SHRINK_INTERVAL_MS);
      setShrinkInterval(shrinkInt);
    }
  }

  function startNewTimeout() {
    const moveCountdown = setTimeout(moveStopped, MOVED_STOPPED_TIMEOUT_MS);
    setMoveTimeout(moveCountdown);
  }

  function shrinkAction() {
    setCircleRadius(radius => {
      if (radius <= CIRCLE_MIN_RADIUS) {
        if (shrinkInterval) {
          clearInterval(shrinkInterval);
          setShrinkInterval(null);
        }
        return CIRCLE_MIN_RADIUS;
      }
      return radius - 1;
    });
  }

  function growAction() {
    setCircleRadius(radius => {
      if (radius >= CIRCLE_MAX_RADIUS) {
        if (growInterval) {
          clearInterval(growInterval);
          setGrowInterval(null);
        }
        return CIRCLE_MAX_RADIUS;
      }
      return radius + 1;
    });
  }

  function moveStopped() {
    setMoveTimeout(null);
    grow();
  }

  function grow() {
    if (shrinkInterval) {
      clearInterval(shrinkInterval);
      setShrinkInterval(null);
    }
    
    if (!growInterval) {
      const growInt = setInterval(growAction, GROW_INTERVAL_MS);
      setGrowInterval(growInt);
    }
  }

  // Event handlers
  function handleMouseMove(e: React.MouseEvent): void {
    setViewCx(e.clientX);
    setViewCy(e.clientY);
  }

  return (
    <div className={styles.flashlight} onMouseMove={handleMouseMove}>
      <svg width={winWidth} height={winHeight} xmlns="http://www.w3.org/2000/svg">
        {/* Define a mask */}
        <mask id="circle-mask">
          {/* White area is visible; black area is cut out */}
          <rect width={winWidth} height={winHeight} fill="white" />
          <circle cx={viewCx} cy={viewCy} r={circleRadius} fill="black" />
        </mask>

        {/* Apply the mask to a black square */}
        <rect
          width={winWidth}
          height={winHeight}
          fill="black"
          mask="url(#circle-mask)"
        />
      </svg>
    </div>
  );
}
