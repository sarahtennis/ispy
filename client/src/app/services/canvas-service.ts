import { SearchablePaths } from "./searchables-service";

export class CanvasService {
  private static _instance: CanvasService;
  private canvasElement: HTMLCanvasElement | null = null;

  private constructor() {}

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public static setCanvasElement(el: HTMLCanvasElement) {
    CanvasService.instance.canvasElement = el;
  }

  public static addToCanvas(paths: SearchablePaths) {
    const context = CanvasService.getCanvasContext();
    if (!context) return;

    if (paths.fill) {
      context.fill(paths.fill);
    }
    if (paths.stroke) {
      context.stroke(paths.stroke);
    }
  }

  private static getCanvasContext(): CanvasRenderingContext2D | null {
    const el = CanvasService.instance.canvasElement;
    if (el?.getContext) {
      return el.getContext('2d');
    }
    return null;
  }
}
