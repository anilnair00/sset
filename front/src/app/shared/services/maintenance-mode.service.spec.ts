import { TestBed } from '@angular/core/testing';
import { MaintenanceModeService } from './maintenance-mode.service';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('MaintenanceModeService', () => {
  let service: MaintenanceModeService;
  let httpClientSpy: { get: jasmine.Spy };
  let ssetStoreSpy: {};

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    ssetStoreSpy = jasmine.createSpyObj('SsetStoreService', ['setError']);
    service = new MaintenanceModeService(<any>httpClientSpy, <any>ssetStoreSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected response', () => {
    const testResponse = {
      isInMaintenance: false
    };

    httpClientSpy.get.and.returnValue(of(testResponse));

    service.getMaintenanceMode().subscribe((response) => {
      expect(response).toEqual(testResponse.isInMaintenance);
    });
  });
});
