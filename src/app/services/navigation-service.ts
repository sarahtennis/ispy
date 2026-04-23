import { NextRouter } from "next/router";

export const Routes = {
  HOME: '/',
  PLAY: '/play',
};

export class NavigationService {
  private static _instance: NavigationService;
  private router: any;
  private redirectAfterRouterSet: boolean = false;
  private redirect: boolean = true;

  private constructor() {}

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public static setRouter(router: any) {
    NavigationService.instance.router = router;
    if (NavigationService.instance.redirectAfterRouterSet) {
      NavigationService.navigateToRoute(Routes.HOME);
    }
  }

  public static navigateToRoute(route: string) {
    NavigationService.instance.router?.push(route);
  }

  public static setRedirect(shouldRedirect: boolean) {
    NavigationService.instance.redirect = shouldRedirect;
  }

  public static shouldRedirect() {
    return NavigationService.instance.redirect;
  }

  public static redirectToHome() {
    if (NavigationService.instance.router) {
      NavigationService.navigateToRoute(Routes.HOME);
    } else {
      NavigationService.instance.redirectAfterRouterSet = true;
    }
  }
}
