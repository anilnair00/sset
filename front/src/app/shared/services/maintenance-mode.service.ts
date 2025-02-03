import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SsetStoreService } from 'src/app/sset-v2/sset-store.service';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceModeService {
  constructor(private http: HttpClient, private store: SsetStoreService) {}

  getMaintenanceMode(): Observable<boolean> {
    const settingsUrl = new URL('WebappSettings', environment.api);

    return this.http.get(settingsUrl.href).pipe(
      take(1),
      map((r) => r['isInMaintenance']),
      catchError((e) => this.store.setError(e))
    );
  }
}
