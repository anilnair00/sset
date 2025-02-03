export interface IErrorModal {
  iconPath: string;
  title: string;
  text?: string;
  text2?: string;
  buttons: ('close' | 'abort' | 'retry')[];
}
