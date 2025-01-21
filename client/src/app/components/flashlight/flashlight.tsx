"use client";

import React, { useEffect, useState } from "react";
import styles from "./flashlight.module.scss";

export default function Flashlight() {
  const [isInitialMouseMove, setIsInitialMouseMove] = useState(true);
  const [moveTimeout, setMoveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [shrinkInterval, setShrinkInterval] = useState<NodeJS.Timeout | null>(null);
  const [growInterval, setGrowInterval] = useState<NodeJS.Timeout | null>(null);
  const [hideCircle, setHideCircle] = useState(true);
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
      if (isInitialMouseMove) {
        setHideCircle(false);
        setIsInitialMouseMove(false);
      }
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
      const shrinkInt = setInterval(shrinkAction, 20);
      setShrinkInterval(shrinkInt);
    }
  }

  function startNewTimeout() {
    const moveCountdown = setTimeout(moveStopped, 500);
    setMoveTimeout(moveCountdown);
  }

  function shrinkAction() {
    setCircleRadius(radius => {
      if (radius <= 100) {
        if (shrinkInterval) {
          clearInterval(shrinkInterval);
          setShrinkInterval(null);
        }
        return 100;
      }
      return radius - 1;
    });
  }

  function growAction() {
    setCircleRadius(radius => {
      if (radius >= 150) {
        if (growInterval) {
          clearInterval(growInterval);
          setGrowInterval(null);
        }
        return 150;
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
      const growInt = setInterval(growAction, 10);
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
