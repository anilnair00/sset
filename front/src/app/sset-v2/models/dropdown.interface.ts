export interface Country {
  code: string;
  description: string;
  dynamicsId: number;
  id: number;
  languageCode: string;
  sortOrder: number;
}

export interface Currency {
  code: string;
  description: string;
  dynamicsId: number;
  id: number;
  languageCode: string;
  sortOrder: number;
  symbol: string;
}

export interface ExpenseType {
  description: string;
  dynamicsId: number;
  id: number;
  languageCode: string;
}

export interface MealType {
  description: string;
  dynamicsId: number;
  id: number;
  languageCode: string;
}

export interface Province {
  code: string;
  countryCode: string;
  description: string;
  id: number;
  languageCode: string;
}

export interface Title {
  description: string;
  dynamicsId: number;
  id: number;
  languageCode: string;
}

export interface TransportationType {
  description: string;
  dynamicsId: number;
  id: number;
  languageCode: string;
}
