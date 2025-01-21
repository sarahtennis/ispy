import { Observable, Subject } from 'rxjs';

const MOVE_EVENT_TYPE = "mousemove";

export interface Coordinates {
  clientX: number;
  clientY: number;
}

export class MouseMoveService {
  private static _instance: MouseMoveService;
  private mouseMove$ = new Subject<Coordinates>();

  private constructor() {}

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public static registerListeners() {
    window.addEventListener(MOVE_EVENT_TYPE, MouseMoveService.instance.onMouseMove);
  }

  public static removeListeners() {
    MouseMoveService.instance.mouseMove$.complete();
    window.removeEventListener(MOVE_EVENT_TYPE, MouseMoveService.instance.onMouseMove);
  }

  private onMouseMove(e: MouseEvent) {
    MouseMoveService.instance.mouseMove$.next({
      clientX: e.clientX,
      clientY: e.clientY
    });
  }

  public getMouseMoveObservable(): Observable<Coordinates> {
    return MouseMoveService.instance.mouseMove$.asObservable();
  }

  public static destroy() {
  }
}
