import { CanvasService } from "./canvas-service";

export interface SearchablePaths {
  fill?: Path2D;
  stroke?: Path2D;
}

export class SearchablesService {
  private static _instance: SearchablesService;
  private displayedSearchables: SearchablePaths[] = [];

  private constructor() {}

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public static createSearchable() {
    const target = new Path2D();
    target.rect(10, 10, 30, 30);

    const paths = {
      fill: target,
    };

    CanvasService.addToCanvas(paths);
    SearchablesService.instance.displayedSearchables.push(paths);
  }
}
