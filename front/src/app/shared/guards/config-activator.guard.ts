import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  RouterStateSnapshot
} from '@angular/router';
import { HeaderService } from '../services/header.service';
import { IHeaderConfig } from '../models/header-config.interface';

@Injectable()
export class ConfigActivator implements CanActivate, CanDeactivate<any> {
  public constructor(private headerService: HeaderService) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const headerConf: IHeaderConfig = route.data.header
      ? route.data.header
      : undefined;
    this.headerService.setHeader(headerConf);
    return true;
  }

  public canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean {
    this.headerService.reset();
    return true;
  }
}
