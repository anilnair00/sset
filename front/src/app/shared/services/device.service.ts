import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  constructor(private deviceService: DeviceDetectorService) {}

  isTouch = this.isTouchDevice();
  isMobile = this.deviceService.isMobile();
  isTablet = this.deviceService.isTablet();
  isDesktop = this.deviceService.isDesktop();
  deviceInfo = this.deviceService.getDeviceInfo();

  private isTouchDevice() {
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');

    var mq = function (query) {
      return window.matchMedia(query).matches;
    };

    // @ts-ignore
    if ('ontouchstart' in window || window.TouchEvent) {
      return true;
    }

    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(
      ''
    );
    return mq(query);
  }
}
