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
    if (!context) return null;

    context.save();

    const translate = findable.transformation.translate;
    context.translate(translate.x, translate.y);

    const scale = findable.transformation.scale;
    context.scale(scale.x, scale.y);

    if (findable.transformation.rotate) {
      context.rotate(findable.transformation.rotate * Math.PI / 180);
    }

    const separated = CanvasService.separatePaths(findable.d);
    if (!separated) {
      // Incorrect path format
      return null;
    }

    const { outerPath, innerPaths } = separated;
    context.lineWidth = 3 / scale.x
    context.strokeStyle = '#000';
    context.stroke(outerPath);

    if (findable.color) {
      context.fillStyle = findable.color;
    }

    if (findable.fillRule) {
      context.fill(new Path2D(findable.d), findable.fillRule);
    } else {
      context.fill(new Path2D(findable.d));
    }

    context.clip(outerPath);

    context.fillStyle = '#FFF';
    innerPaths.forEach((path: Path2D) => {
      context.fill(path);
    });

    context.restore();

    return outerPath;
  }

  private static separatePaths(d: string) {
    // Split subpaths based on Move To
    const subpaths = d.match(/M[^M]+/g) || [];

    // Shouldn't happen, but TODO add alerting because it is
    // an unaccepted svg d format
    if (!subpaths.length) return null;
    
    // Assume the first is outer, others are inner
    const outerPath = new Path2D(subpaths[0]) || null;
    const innerPaths = subpaths.slice(1).map(p => new Path2D(p));
    
    return { outerPath, innerPaths };
}

  private static getCanvasContext(): CanvasRenderingContext2D | null {
    const el = CanvasService.instance.canvasElement;
    if (el?.getContext) {
      return el.getContext("2d");
    }
    return null;
  }
}
