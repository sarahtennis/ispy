const IMAGE_BASE_PATH = "./searchables-assets/";

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
          // Single path SVG
          if (paths.length === 1) {
            SvgService.addSvgDefinitionToStore({
              category: categoryNameKey,
              image: svgName,
              paths: [{
                d: paths[0].getAttribute('d'),
                color: paths[0].style.fill,
                fillRule: <CanvasFillRule>paths[0].getAttribute('fill-rule')
              }],
            });
            return;
          }
          // Multiple paths in SVG
          const pathDefs: PathDefinition[] = [];
          let insertObject: Partial<PathDefinition> = null;
          paths.forEach((path, index) => {
            const d = path.getAttribute("d");
            const color = path.style.fill;
            // evenodd
            const isEvenOdd = <CanvasFillRule>path.getAttribute("fill-rule") === 'evenodd';
            if (isEvenOdd) {
              insertObject = null;
              pathDefs.push({
                d,
                color,
                fillRule: 'evenodd',
              });
              return;
            }
            // First is nonzero or previous was evenodd
            if (!insertObject) {
              insertObject = {
                fillRule: 'nonzero',
                color,
                d
              };
            } else {
              // Check to see if we can combine ds from paths
              if (color === insertObject.color) {
                insertObject.d = insertObject.d + ` ${d}`;
              } else {
                pathDefs.push(<PathDefinition>insertObject);
                insertObject = {
                  fillRule: 'nonzero',
                  color,
                  d
                };
                if (index >= paths.length) {
                  pathDefs.push(<PathDefinition>insertObject);
                }
              }
            }
          });
          SvgService.addSvgDefinitionToStore({
            category: categoryNameKey,
            image: svgName,
            paths: pathDefs,
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
