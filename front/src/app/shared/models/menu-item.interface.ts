export interface IMenuItem {
  text?: string;
  i18n?: string;
  path?: string;
  params?: string[];
  class?: string;
  id?: string;
  items?: IMenuItem;
  exactMatch?: boolean;
  newWindow?: boolean;
}
