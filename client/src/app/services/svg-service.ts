const IMAGE_BASE_PATH = "/searchables-assets/";

interface SvgDefinitionStore {
  [category: string]: SvgDefinition;
}

interface SvgDefinition {
  [image: string]: PathDefinition[];
}

interface PathDefinition {
  d: string;
  color?: string;
  fillRule?: string;
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
    categories: { categoryName: string; svgNames: string[]; }[]
  ) {
    for (let category of categories) {
      const categoryPath = IMAGE_BASE_PATH + category.categoryName;
      for (let svgName of category.svgNames) {
        if (
          !SvgService.instance.svgDefinitionStore[category.categoryName] ||
          !SvgService.instance.svgDefinitionStore[category.categoryName][
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
            const fillRule = path.getAttribute("fill-rule");
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
            category: category.categoryName,
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
