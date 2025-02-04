import { CanvasService } from "./canvas-service";
import { SvgService } from "./svg-service";
import { WindowService } from "./window-service";

type Count = number;
type Angle = number;

interface Sizes {
  [size: string]: {
    [color: string]: Count
  }
}

interface CreateFindablesOptions {
  [category: string]: {
    [image: string]: {
      defaultSize: number;
      sizes: Sizes;
    }
  }
}

export interface Findable {
  id: number;
  path: Path2D;
  color?: string;
  fillRule?: CanvasFillRule;
  transformation: {
    translate: {
      x: number;
      y: number;
    };
    scale: {
      x: number;
      y: number;
    };
    rotate?: Angle;
  };
}

export class FindablesService {
  private static _instance: FindablesService;
  private visibleFindables: Findable[] = [];
  private idIncrementer = 0;

  private constructor() {}

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public static createFindables(options: CreateFindablesOptions) {
    Object.keys(options).forEach((category) => {
      Object.keys(options[category]).forEach((imageName) => {
        const imageOptions = options[category][imageName];
        FindablesService.generateFindablesForImage({
          category,
          image: imageName,
          defaultSize: imageOptions.defaultSize,
          sizes: imageOptions.sizes
        });
      });
    });
  }

  private static generateFindablesForImage(options: {category: string, image: string, defaultSize: number, sizes: Sizes}) {
    const pathDefs = SvgService.getSvgPathDefinitions(options.category, options.image);
    if (!pathDefs) return;

    Object.keys(options.sizes).forEach((size) => {
      const sizeNum = Number(size);
      const sizeColors = options.sizes[size];
      Object.keys(sizeColors).forEach(color => {
        const canvasScale = sizeNum / options.defaultSize;
        for (let count = sizeColors[color]; count >= 0; count--) {
          pathDefs.forEach((path) => {
            const translation = FindablesService.generateRandomTranslation(sizeNum);
            const findable: Findable = {
              id: FindablesService.instance.idIncrementer++,
              path: new Path2D(path.d),
              transformation: {
                translate: translation,
                scale: {
                  x: canvasScale,
                  y: canvasScale,
                },
                rotate: FindablesService.generateRandomRotation(-10, 10)
              }
            };
            findable.color = color;
            if (path.fillRule) {
              findable.fillRule = path.fillRule;
            }
            FindablesService.addFindableToCanvas(findable);
          });
        }
      });
    });
  }

  private static addFindableToCanvas(findable: Findable) {
    FindablesService.instance.visibleFindables.push(findable);
    CanvasService.drawFindable(findable);
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
  private static getRandomIntInclusive(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
  }

  private static generateRandomTranslation(size: number) {
    const dimensions = WindowService.getDimensions();
    const upper = dimensions.height - size;
    const lower = size;
    const left = size;
    const right = dimensions.width - size;
    return {
      x: FindablesService.getRandomIntInclusive(left, right),
      y: FindablesService.getRandomIntInclusive(lower, upper)
    }
  }

  private static generateRandomRotation(minDeg: number, maxDeg: number) {
    return FindablesService.getRandomIntInclusive(minDeg, maxDeg);
  }
}
