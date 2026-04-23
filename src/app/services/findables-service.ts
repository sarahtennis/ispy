import { CanvasService } from "./canvas-service";
import { PathDefinition, SvgService } from "./svg-service";
import { WindowService } from "./window-service";

type Count = number;
type Angle = number;

interface Sizes {
  [size: string]: {
    [color: string]: Count;
  };
}

interface CreateFindablesOptions {
  [category: string]: {
    [image: string]: {
      defaultSize: {
        height: number;
        width: number;
      };
      color?: string;
      count: number;
      scaledHeightInPixels: number;
    };
  };
}

export interface Findable {
  id: number;
  d: string;
  pathDefinitions: PathDefinition[];
  targetFillPath: Path2D;
  // Overwrite default color?
  color?: string;
  transformation: {
    translate: {
      x: number;
      y: number;
    };
    scale: number;
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
        debugger;
        FindablesService.generateFindablesForImage({
          category,
          color: imageOptions.color,
          image: imageName,
          defaultSize: imageOptions.defaultSize,
          scaledHeightInPixels: imageOptions.scaledHeightInPixels,
          count: imageOptions.count,
        });
      });
    });
    // Testing
    CanvasService.drawBackground();
  }

  private static generateFindablesForImage(options: {
    category: string;
    image: string;
    defaultSize: { height: number; width: number };
    scaledHeightInPixels: number;
    count: number;
    color?: string;
  }) {
    const pathDefs = SvgService.getSvgPathDefinitions(
      options.category,
      options.image
    );
    if (!pathDefs) return;

    let scaledHeight = options.defaultSize.height;
    if (options.scaledHeightInPixels) {
      scaledHeight = options.scaledHeightInPixels;
    }
    const canvasScale = scaledHeight / options.defaultSize.height;

    for (let x = 0; x < options.count; x++) {
      const translation = FindablesService.generateRandomTranslation({height: options.defaultSize.height, width: options.defaultSize.width});
      const findable: Partial<Findable> = {
        id: FindablesService.instance.idIncrementer++,
        pathDefinitions: pathDefs,
        color: options.color,
        transformation: {
          translate: translation,
          scale: canvasScale
        }
      };
      FindablesService.addFindableToCanvas(findable);
    }
  }

  private static addFindableToCanvas(findable: Partial<Findable>) {
    console.log(findable);
    const targetPath = CanvasService.drawFindable(<Findable>findable);
    if (!targetPath) {
      return;
    }
    const add = { ...findable };
    add.targetFillPath = targetPath;
    FindablesService.instance.visibleFindables.push(<Findable>add);
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
  private static getRandomIntInclusive(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
  }

  private static generateRandomTranslation(size: {height: number, width: number}) {
    const dimensions = WindowService.getDimensions();
    const upper = dimensions.height - size.height;
    const lower = size.height;
    const left = size.width;
    const right = dimensions.width - size.width;
    return {
      x: FindablesService.getRandomIntInclusive(left, right),
      y: FindablesService.getRandomIntInclusive(lower, upper),
    };
  }

  private static generateRandomRotation(minDeg: number, maxDeg: number) {
    return FindablesService.getRandomIntInclusive(minDeg, maxDeg);
  }
}
