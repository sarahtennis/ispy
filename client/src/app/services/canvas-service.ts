import { Findable } from "./findables-service";

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

  public static drawFindable(findable: Findable) {
    const context = CanvasService.getCanvasContext();
    if (!context) return;

    context.save();

    if (findable.color) {
      context.fillStyle = findable.color;
    }

    const translate = findable.transformation.translate;
    context.translate(translate.x, translate.y);

    const scale = findable.transformation.scale;
    context.scale(scale.x, scale.y);

    if (findable.transformation.rotate) {
      context.rotate(findable.transformation.rotate);
    }

    if (findable.fillRule) {
      context.fill(findable.path, findable.fillRule);
    } else {
      context.fill(findable.path);
    }

    context.restore();
  }

  private static getCanvasContext(): CanvasRenderingContext2D | null {
    const el = CanvasService.instance.canvasElement;
    if (el?.getContext) {
      return el.getContext("2d");
    }
    return null;
  }
}
