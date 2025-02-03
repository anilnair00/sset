import {
  Currency,
  ExpenseType,
  MealType,
  TransportationType
} from './dropdown.interface';
import { ReceiptRequest } from './api-dynamics-web-request.interface';

export interface ExpenseDetails {
  accommodationDays: number;
  amount: number;
  currency: string;
  currencyCode: string;
  currencyDynamicsId: number;
  disruptionCity: string;
  expenseType: string;
  expenseTypeDynamicsId: number;
  expenseTypeId: number;
  mealType: string;
  mealTypeDynamicsId: number;
  transportationType: string;
  transportationTypeDynamicsId: number;
  checkInDate?: string;
  checkOutDate?: string;
  receipt?: File;
  receiptFileList?: FileList;
  receiptFileRequest?: ReceiptRequest[];
  transactionDate?: string;
  transportationtransactionDate?: string;
}

export interface ExpenseForm {
  currencies: Currency[];
  expenseTypes: ExpenseType[];
  mealTypes: MealType[];
  transportationTypes: TransportationType[];
}

export interface ReceiptDeleteResult {
  fileName: string;
  isSuccessful: boolean;
}

export interface ReceiptScanResult {
  scanResults: ScanResult[];
  ticketNumber: string;
}

interface ScanResult {
  fileName: string;
  hasMalware: false;
  isScanned: true;
  indexTags: {
    ['Malware Scanning scan time UTC']: string;
    ['Malware Scanning scan result']: string;
  };
  message: 'No threats found!';
}

export interface UploadExpenseReceipt {
  isSuccessful: boolean;
  message: string;
}
