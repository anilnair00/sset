import { Airport } from '../../models/airport.interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, timeout } from 'rxjs';
import { Province } from '../../models/dropdown.interface';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private apiCode = environment.apiCode;
  private baseUrl = environment.api;
  provinceFormData$: Observable<Province[]>;

  constructor(private http: HttpClient) {}

  getAirports(lang: string): Observable<Airport[]> {
    const url = new URL(
      `GetAirports?code=${environment.apiCode}&languageCode=${lang}-CA`,
      this.baseUrl
    );
    return this.http.get<Airport[]>(url.href).pipe(
      timeout(20000),
      map((a: Airport[]) => a)
    );
  }

  getProvinceDetails$(
    languageCode: string,
    countryCode: string
  ): Observable<Province[]> {
    const url = new URL(
      `GetProvinces?code=${this.apiCode}&languageCode=${languageCode}-CA&countryCode=${countryCode}`,
      this.baseUrl
    );
    this.provinceFormData$ = this.http.get<Province[]>(url.href);
    return this.provinceFormData$;
  }
}
