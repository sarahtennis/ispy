import { Findable } from "./findables-service";
import { WindowService } from "./window-service";

export class CanvasService {
  private static _instance: CanvasService;
  private canvasElement: HTMLCanvasElement | null = null;
  private backgroundCanvasElement: HTMLCanvasElement | null = null;

  private constructor() {}

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public static setCanvasElement(el: HTMLCanvasElement) {
    CanvasService.instance.canvasElement = el;
  }

  public static setBackgroundCanvasElement(el: HTMLCanvasElement) {
    CanvasService.instance.backgroundCanvasElement = el;
  }

  public static drawBackground() {
    const context = CanvasService.getBackgroundCanvasContext();
    if (context) {
      const { height, width } = WindowService.getDimensions();
      const bgImage = new Image();
      bgImage.onload = (ev: Event) => {
        const heightScale = height / bgImage.height;
        const coversWidthAtHeightScale = (bgImage.width * heightScale) >= width;
        if (coversWidthAtHeightScale) {
          context.save();
          context.scale(heightScale, heightScale);
          context.drawImage(bgImage, 0, 0);
          context.restore();
        } else {
          const widthScaleToFull = width / (bgImage.width * heightScale);
          context.save();
          context.scale(widthScaleToFull, widthScaleToFull);
          context.drawImage(bgImage, 0, 0);
          context.restore();
        }
      };
      bgImage.src = "./backgrounds/cottage.svg";
    }
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
      context.rotate((findable.transformation.rotate * Math.PI) / 180);
    }

    context.lineWidth = 3 / scale.x;
    context.strokeStyle = "#000";

    if (findable.pathDefinitions.length === 1) {
      const def = findable.pathDefinitions[0];
      if (def.fillRule !== "evenodd") {
        const path = new Path2D(def.d);
        context.stroke(path);
        if (def.color) {
          context.fillStyle = def.color;
        }
        context.fill(path);
        context.restore();
        return path;
      }
      const separated = CanvasService.separatePaths(def.d);
      const { outerPath, innerPaths } = separated;
      context.stroke(outerPath);
      context.fillStyle = findable.color || def.color;
      context.fill(new Path2D(def.d));
      context.clip(outerPath);
      context.fillStyle = "#FFF";
      innerPaths.forEach((path: Path2D) => {
        context.fill(path);
      });
      context.restore();
      return outerPath;
    } else {
      let targetPath: Path2D = new Path2D();
      // Multi path, currently all nonzero
      findable.pathDefinitions.forEach((definition) => {
        if (definition.color) {
          context.fillStyle = definition.color;
        }
        const defPath = new Path2D(definition.d);
        targetPath.addPath(defPath);
        context.fill(defPath);
      });
      context.restore();
      return targetPath;
    }
  }

  private static separatePaths(d: string) {
    // Split subpaths based on Move To
    const subpaths = d.match(/M[^M]+/g) || [];

    // Shouldn't happen, but TODO add alerting because it is
    // an unaccepted svg d format
    if (!subpaths.length) return null;

    // Assume the first is outer, others are inner
    const outerPath = new Path2D(subpaths[0]) || null;
    const innerPaths = subpaths.slice(1).map((p) => new Path2D(p));

    return { outerPath, innerPaths };
  }

  private static getCanvasContext(): CanvasRenderingContext2D | null {
    const el = CanvasService.instance.canvasElement;
    if (el?.getContext) {
      return el.getContext("2d");
    }
    return null;
  }

  private static getBackgroundCanvasContext(): CanvasRenderingContext2D | null {
    const el = CanvasService.instance.backgroundCanvasElement;
    if (el?.getContext) {
      return el.getContext("2d");
    }
    return null;
  }
}
