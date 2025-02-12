"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./flashlight.module.scss";
import { Coordinates, MouseMoveService } from "@/services/mouse-move-service";
import { Dimensions, WindowService } from "@/services/window-service";

const MOVED_STOPPED_TIMEOUT_MS = 100;
const SHRINK_INTERVAL_MS = 20;
const GROW_INTERVAL_MS = 5;
const CIRCLE_MAX_RADIUS = 150;
const CIRCLE_MIN_RADIUS = 125;

export default function Flashlight() {
  const moveTimeout = useRef<NodeJS.Timeout | null>(null);
  const shrinkInterval = useRef<NodeJS.Timeout | null>(null);
  const growInterval = useRef<NodeJS.Timeout | null>(null);
  const [circleRadius, setCircleRadius] = useState(CIRCLE_MAX_RADIUS);
  const [circleCenter, setCircleCenter] = useState({ cx: 0, cy: 0 });
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  const subscribeToObservables = useRef((coords: Coordinates) => {
    setCircleCenter({
      cx: coords.clientX,
      cy: coords.clientY
    });
    if (!moveTimeout.current) {
      startMove();
    } else {
      restartMoveTimeout();
    }
  });

  useEffect(() => {
    // Setup
    MouseMoveService.getMouseMoveObservable().subscribe((coords: Coordinates) => {
      subscribeToObservables.current(coords);
    });

    WindowService.getWindowResizeObservable().subscribe((dimensions: Dimensions) => {
      setWindowDimensions({ width: dimensions.width, height: dimensions.height });
    });
    // return teardown;
  }, []);

  function shrink() {
    if (growInterval.current) {
      clearInterval(growInterval.current);
      growInterval.current = null;
    }

    if (!shrinkInterval.current) {
      const shrinkInt = setInterval(shrinkAction, SHRINK_INTERVAL_MS);
      shrinkInterval.current = shrinkInt;
    }
  }

  function startNewTimeout() {
    const moveCountdown = setTimeout(moveStopped, MOVED_STOPPED_TIMEOUT_MS);
    moveTimeout.current = moveCountdown;
  }

  function shrinkAction() {
    setCircleRadius(radius => {
      if (radius <= CIRCLE_MIN_RADIUS) {
        if (shrinkInterval.current) {
          clearInterval(shrinkInterval.current);
          shrinkInterval.current = null;
        }
        return CIRCLE_MIN_RADIUS;
      }
      return radius - 1;
    });
  }

  function growAction() {
    setCircleRadius(radius => {
      if (radius >= CIRCLE_MAX_RADIUS) {
        if (growInterval.current) {
          clearInterval(growInterval.current);
          growInterval.current = null;
        }
        return CIRCLE_MAX_RADIUS;
      }
      return radius + 1;
    });
  }

  function moveStopped() {
    moveTimeout.current = null;
    grow();
  }

  function grow() {
    if (shrinkInterval.current) {
      clearInterval(shrinkInterval.current);
      shrinkInterval.current = null;
    }

    if (!growInterval.current) {
      const growInt = setInterval(growAction, GROW_INTERVAL_MS);
      growInterval.current = growInt;
    }
  }

  function startMove() {
    shrink();
    startNewTimeout();
  }

  function restartMoveTimeout() {
    if (moveTimeout.current) {
      clearTimeout(moveTimeout.current);
    }
    startNewTimeout();
  }

  return (
    <div className={styles.flashlight}>
      <svg width={windowDimensions.width} height={windowDimensions.height} xmlns="http://www.w3.org/2000/svg">
        {/* Define a mask */}
        <mask id="circle-mask">
          {/* White area is visible; black area is cut out */}
          <rect width={windowDimensions.width} height={windowDimensions.height} fill="white" />
          <circle cx={circleCenter.cx} cy={circleCenter.cy} r={circleRadius} fill="black" />
        </mask>

        {/* Apply the mask to a black square */}
        <rect
          width={windowDimensions.width}
          height={windowDimensions.height}
          fill="black"
          mask="url(#circle-mask)"
        />
      </svg>
    </div>
  );
}
