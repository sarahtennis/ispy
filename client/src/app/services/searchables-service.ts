export class SearchablesService {
  private static _instance: SearchablesService;

  private constructor() {}

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
}
