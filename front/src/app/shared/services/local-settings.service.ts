import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LocalSettingsService {
  constructor(private cookie: CookieService) {}

  /**
   * Get a cookie by name
   * @param cookie: string
   */
  get(cookie: string): string {
    return this.cookie.get(cookie);
  }

  /**
   * Set a cookie by name and value
   * @param cookie: string
   * @param value: string
   */
  set(cookie: string, value: string) {
    this.cookie.set(cookie, value, 1000, '/');
  }

  /**
   * Delete a cookie by name
   * @param cookie: string
   */
  remove(cookie: string) {
    this.cookie.delete(cookie, '/');
  }

  /**
   * Shortened methods to get, set and remove used cookies.
   */

  getLanguage(uid?: string): string {
    if (!uid) {
      uid = 'generic';
    }
    return this.get('language-' + uid);
  }

  setLanguage(language: string, uid?: string) {
    if (!uid) {
      uid = 'generic';
    }
    this.set('language-' + uid, language);
  }

  removeLanguage(uid?: string) {
    return this.remove('language-' + uid);
  }

  getInitialUrl(): string {
    return this.get('initialUrl');
  }

  setInitialUrl(url: string) {
    return this.set('initialUrl', url);
  }

  removeInitialUrl() {
    return this.remove('initialUrl');
  }
}
