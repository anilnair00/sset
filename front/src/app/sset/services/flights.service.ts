import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlightsService {
  constructor() {}

  static separateFlightNumber(
    completeFlightNumber: string
  ): ISplitFlightNumber {
    if (!completeFlightNumber) {
      return null;
    }

    const splitFlightNumber = completeFlightNumber.split(' ');

    if (!splitFlightNumber || splitFlightNumber.length < 2) {
      return null;
    }

    const airlineCode = splitFlightNumber[0];
    const flightNumber = parseInt(splitFlightNumber[1], 10);

    return { airlineCode: airlineCode, flightNumber: flightNumber };
  }
}

export interface ISplitFlightNumber {
  airlineCode: string;
  flightNumber: number;
}
