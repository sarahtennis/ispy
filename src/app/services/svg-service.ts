const IMAGE_BASE_PATH = "/searchables-assets/";

interface SvgDefinitionStore {
  [category: string]: SvgDefinition;
}

interface SvgDefinition {
  [image: string]: PathDefinition[];
}

export interface PathDefinition {
  d: string;
  color?: string;
  fillRule?: CanvasFillRule;
}

export interface CategoryDefinition {
  categoryName: string;
  svgNames: string[];
}

export class SvgService {
  private static _instance: SvgService;
  private svgDefinitionStore: SvgDefinitionStore = {};

  private constructor() {}

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public static async loadScenarioSvgs(
    categories: { [categoryName: string] : string[]; }
  ) {
    for (const categoryNameKey of Object.keys(categories)) {
      const imageNames = categories[categoryNameKey];
      const categoryPath = IMAGE_BASE_PATH + categoryNameKey;
      for (const svgName of imageNames) {
        if (
          !SvgService.instance.svgDefinitionStore[categoryNameKey] ||
          !SvgService.instance.svgDefinitionStore[categoryNameKey][
            svgName
          ]
        ) {
          const svgPath = `${categoryPath}/${svgName}.svg`;
          const file = await fetch(svgPath);
          const svgText = await file.text();
          const svgDomElement = SvgService.createSvgElement(svgText);
          const paths = svgDomElement.querySelectorAll("path");
          const imagePaths: PathDefinition[] = [];
          paths.forEach((path) => {
            const d = path.getAttribute("d");
            const color = path.getAttribute("fill");
            const fillRule = <CanvasFillRule>path.getAttribute("fill-rule");
            if (d) {
              const pathDef: PathDefinition = { d };
              if (color) {
                pathDef.color = color;
              }
              if (fillRule) {
                pathDef.fillRule = fillRule;
              }
              imagePaths.push(pathDef);
            }
          });
          SvgService.addSvgDefinitionToStore({
            category: categoryNameKey,
            image: svgName,
            paths: imagePaths,
          });
        }
      }
    }
  }

  public static getSvgPathDefinitions(category: string, image: string) {
    if (!SvgService.instance.svgDefinitionStore[category]) {
      return null;
    }
    return SvgService.instance.svgDefinitionStore[category][image] || null;
  }

  private static createSvgElement(svgString: string): HTMLElement {
    // Create a DOM parser to manipulate the SVG string
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = svgDoc.documentElement;
    return svgElement;
  }

  private static addSvgDefinitionToStore(def: {
    category: string;
    image: string;
    paths: PathDefinition[];
  }) {
    if (!SvgService.instance.svgDefinitionStore[def.category]) {
      SvgService.instance.svgDefinitionStore[def.category] = {};
    }
    SvgService.instance.svgDefinitionStore[def.category][def.image] = def.paths;
  }
}
