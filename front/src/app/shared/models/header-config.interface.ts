import { IMenuItem } from './menu-item.interface';

export interface IHeaderConfig {
  logo?: string | ILogoPath[];
  title?: string;
  menu?: IMenuItem[];
  langs?: string[];
}

export interface ILogoPath {
  lang: string;
  path: string;
}
