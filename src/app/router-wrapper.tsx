"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MouseMoveService } from "@/services/mouse-move-service";
import { NavigationService } from "@/services/navigation-service";
import { WindowService } from "@/services/window-service";

export default function RouterWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    NavigationService.setRouter(router);

    const registerListeners = () => {
      WindowService.registerListeners();
      MouseMoveService.registerListeners();
    };

    registerListeners();

    return () => {
      WindowService.removeListeners();
      MouseMoveService.removeListeners();
    };
  }, []);

  return (
    <body>
      {children}
    </body>
  );
}
