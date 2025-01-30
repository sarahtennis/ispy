import { SvgService } from "./svg-service";

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

  public static async test() {
    const context = CanvasService.getCanvasContext();
    if (!context) return;

    await SvgService.loadScenarioSvgs([
      {
        categoryName: "fruit",
        svgNames: ["apple"],
      },
    ]);

    const appleDefinition = SvgService.getSvgPathDefinitions('fruit', 'apple');

    context.save();

    appleDefinition?.forEach(path => {
      const drawPath = new Path2D(path.d);
      context.save();
      if (path.color) {
        context.fillStyle = path.color;
      }
      // test - red, 2x size, moved 200,200
      if (true) {
        context.fillStyle = 'red';
        context.translate(200, 200);
        context.scale(2, 2);
      }

      if (path.fillRule) {
        context.fill(drawPath, <CanvasFillRule>path.fillRule);
      } else {
        context.fill(drawPath);
      }
    });

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
