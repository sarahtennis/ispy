import { FindablesService } from "./findables-service";
import { SvgService } from "./svg-service";

const SCENARIOS_BASE_PATH = '/scenarios/';

export class ScenarioService {
  private static _instance: ScenarioService;

  private constructor() {}

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public static async loadScenario(scenario: string) {
    try {
      const scenarioFile = await fetch(`./${SCENARIOS_BASE_PATH}${scenario}.json`);
      const scenarioDefinition = await scenarioFile.json();
      await SvgService.loadScenarioSvgs({
        ...scenarioDefinition.load
      });
      FindablesService.createFindables(scenarioDefinition.findables);
    } catch (e) {
      console.log('Scenario does not exist.', e);
    }
  }
}
