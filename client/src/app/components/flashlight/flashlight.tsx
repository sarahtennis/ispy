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
    componentDidMount();

    return () => {
      componentWillUnmount();
    };
  }, []);

  // Lifecycle
  function componentDidMount() {
    initialSetup();
  }

  function componentWillUnmount() {}

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
    const growInt = setInterval(growAction, 10);
    setGrowInterval(growInt);
  }

  function shrink() {
    if (growInterval) {
      clearInterval(growInterval);
      setGrowInterval(null);
    }
    const shrinkInt = setInterval(shrinkAction, 20);
    setShrinkInterval(shrinkInt);
  }

  function startMove() {
    shrink();
    startNewTimeout();
  }

  function startNewTimeout() {
    const moveCountdown = setTimeout(moveStopped, 100);
    setMoveTimeout(moveCountdown);
  }

  function restartMoveTimeout() {
    if (moveTimeout) {
      clearTimeout(moveTimeout);
    }
    startNewTimeout();
  }

  // Event handlers
  function handleMouseMove(e: React.MouseEvent): void {
    setViewCx(e.clientX);
    setViewCy(e.clientY);

    if (!moveTimeout) {
      if (isInitialMouseMove) {
        setHideCircle(false);
        setIsInitialMouseMove(false);
      }
      startMove();
    } else {
      restartMoveTimeout();
    }
  }

  function getMaskValue() {
    return hideCircle ? undefined : "url(#circle-mask)";
  }

  // Init
  function initialSetup() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setWinWidth(width);
    setWinHeight(height);
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
          mask={getMaskValue()}
        />
      </svg>
    </div>
  );
}
