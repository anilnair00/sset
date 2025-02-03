import { environment } from 'src/environments/environment';
import { ExpenseForm, ReceiptScanResult } from '../../models/expense.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private apiCode = environment.apiCode;
  private baseUrl = environment.api;

  expenseFormData$: Observable<ExpenseForm>;

  constructor(private http: HttpClient) {}

  delayWithCancellation(ms: number, signal: AbortSignal): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(resolve, ms);
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new DOMException('The operation was aborted.', 'AbortError'));
      });
    });
  }

  getExpenseFormData$(languageCode: string): Observable<ExpenseForm> {
    const url = new URL(
      `GetExpenseFormLookupData?code=${this.apiCode}&languageCode=${languageCode}-CA`,
      this.baseUrl
    );
    this.expenseFormData$ = this.http.get<ExpenseForm>(url.href);
    return this.expenseFormData$;
  }

  async performMalwareDetection(
    fileName: string,
    receiptBinary: ArrayBuffer,
    ticketNumber: string,
    deleteFiles: boolean,
    signal: AbortSignal
  ) {
    const getExpenseReceiptScanResultUrl = new URL(
      `GetExpenseReceiptScanResult?code=${this.apiCode}&ticketNumber=${ticketNumber}&deleteFiles=${deleteFiles}&fileName=${fileName}`,
      this.baseUrl
    );
    const uploadExpenseReceiptUrl = new URL(
      `UploadExpenseReceipt?code=${this.apiCode}`,
      this.baseUrl
    );

    const uploadExpenseReceiptFormData = new FormData();
    uploadExpenseReceiptFormData.append(
      'file',
      new Blob([receiptBinary], { type: 'application/octet-stream' }),
      fileName
    );
    uploadExpenseReceiptFormData.append('ticketNumber', ticketNumber);

    try {
      const uploadResponse = await fetch(uploadExpenseReceiptUrl.href, {
        method: 'POST',
        body: uploadExpenseReceiptFormData,
        signal: signal
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload expense receipt');
      }

      // 5 second delay before calling the getScanResults API
      await this.delayWithCancellation(5000, signal);

      let retries = 0;
      let receiptScanResult: ReceiptScanResult;
      while (retries < 3) {
        const response = await fetch(getExpenseReceiptScanResultUrl.href, {
          signal: signal
        });
        
        if (!response.ok) {
          throw new Error('Failed to get expense receipt scan result');
        }

        receiptScanResult = await response.json();
        if (receiptScanResult.scanResults.length > 0) {
          break; // Exit the loop if scan results are found
        }

        await this.delayWithCancellation(3000, signal);
        retries++;
      }

      if (receiptScanResult.scanResults.length === 0) {
        throw new Error('No scan results after maximum retries');
      }

      return receiptScanResult.scanResults[0]?.hasMalware;
    } catch (error) {}
  }
}
