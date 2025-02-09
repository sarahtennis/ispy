import { BehaviorSubject } from "rxjs";

const WINDOW_RESIZE_EVENT_TYPE = "resize";
const RESIZE_DEBOUNCE_MS: number = 100;

export interface Dimensions {
  width: number;
  height: number;
}

export class WindowService {
  private static _instance: WindowService;
  private windowDimensions$ = new BehaviorSubject<Dimensions>({width: 0, height: 0});
  private timeout: NodeJS.Timeout | null = null;

  private constructor() {}

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public static registerListeners() {
    window.addEventListener(
      WINDOW_RESIZE_EVENT_TYPE,
      WindowService.onWindowResizeEmit
    );
    WindowService.setWindowDimensions(window.innerWidth, window.innerHeight);
  }

  public static removeListeners() {
    window.removeEventListener(
      WINDOW_RESIZE_EVENT_TYPE,
      WindowService.onWindowResizeEmit
    );
  }

  public static getWindowResizeObservable() {
    return WindowService.instance.windowDimensions$.asObservable();
  }

  public static getDimensions() {
    return WindowService.instance.windowDimensions$.value;
  }

  private static onWindowResizeEmit() {
    if (WindowService.instance.timeout) {
      clearTimeout(WindowService.instance.timeout);
    }
    WindowService.instance.timeout = setTimeout(() => {
      WindowService.onResizeFinish();
    }, RESIZE_DEBOUNCE_MS);
  }

  private static onResizeFinish() {
    WindowService.setWindowDimensions(window.innerWidth, window.innerHeight);
  }

  private static setWindowDimensions(width: number, height: number) {
    WindowService.instance.windowDimensions$.next({width, height});
  }

  public static destroy() {}
}
