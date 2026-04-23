import { FindablesService } from "./findables-service";
import { SvgService } from "./svg-service";

const SCENARIOS_BASE_PATH = "/scenarios/";
const TEST_SOCK_SCENARIO = {
  load: {
    fruit: ["apple"],
  },
  findables: {
    fruit: {
      apple: {
        defaultSize: {
          height: 243.2,
          width: 308.2,
        },
        color: "green",
        count: 2,
        scaledHeightInPixels: 300,
      },
    },
  },
};

export class ScenarioService {
  private static _instance: ScenarioService;

  private constructor() {}

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public static async loadScenario(scenario?: string) {
    let scenarioDefinition = TEST_SOCK_SCENARIO;
    if (scenario) {
      try {
        const scenarioFile = await fetch(
          `./${SCENARIOS_BASE_PATH}${scenario}.json`
        );
        scenarioDefinition = await scenarioFile.json();
      } catch (e) {}
    }
    try {
      await SvgService.loadScenarioSvgs({
        ...scenarioDefinition.load,
      });
      FindablesService.createFindables(scenarioDefinition.findables);
    } catch (e) {
      console.log("Scenario does not exist.", e);
    }
  }
}
