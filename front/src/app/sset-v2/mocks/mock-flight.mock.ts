import { FlightResponse } from '../models/api-gateway.interface';

export const MOCK_FLIGHTS: FlightResponse[] = [
  {
    flightNumber: 871,
    scheduledDepartureDate: '2023-07-04',
    scheduledDepartureTime: '14:00:00',
    scheduledDepartureAirport: 'CDG',
    scheduledArrivalDate: '2023-07-04',
    scheduledArrivalTime: '15:45:00',
    scheduledArrivalAirport: 'YUL',
    scheduledDepartureAirportCityName: 'Paris',
    scheduledArrivalAirportCityName: 'Montreal',
    isCancelledFlight: false,
    airlineCarrierCode: 'AC',
    airlineName: 'AirCanada'
  },
  {
    flightNumber: 423,
    scheduledDepartureDate: '2023-07-04',
    scheduledDepartureTime: '18:10:00',
    scheduledDepartureAirport: 'YUL',
    scheduledArrivalDate: '2023-07-04',
    scheduledArrivalTime: '19:46:00',
    scheduledArrivalAirport: 'YYZ',
    scheduledDepartureAirportCityName: 'Montreal',
    scheduledArrivalAirportCityName: 'Toronto',
    isCancelledFlight: false,
    airlineCarrierCode: 'AC',
    airlineName: 'AirCanada'
  }
];

export const MOCK_FLIGHTS1: FlightResponse[] = [
  {
    flightNumber: 154,
    scheduledDepartureDate: '2023-01-07T00:00:00+00:00',
    scheduledDepartureTime: '23:55:00',
    scheduledDepartureAirport: 'YYC',
    scheduledArrivalDate: '2023-01-08T00:00:00+00:00',
    scheduledArrivalTime: '05:37:00',
    scheduledArrivalAirport: 'YYZ',
    scheduledDepartureAirportCityName: 'Calgary',
    scheduledArrivalAirportCityName: 'Toronto',
    isCancelledFlight: false,
    airlineCarrierCode: 'AC ',
    airlineName: null
  }
];

export const MOCK_FLIGHTS2: FlightResponse[] = [
  {
    flightNumber: 43,
    scheduledDepartureDate: '2020-01-02T00:00:00+00:00',
    scheduledDepartureTime: '00:45:00',
    scheduledDepartureAirport: 'DEL',
    scheduledArrivalDate: '2020-01-02T00:00:00+00:00',
    scheduledArrivalTime: '05:25:00',
    scheduledArrivalAirport: 'YYZ',
    scheduledDepartureAirportCityName: 'Delhi',
    scheduledArrivalAirportCityName: 'Toronto',
    isCancelledFlight: false,
    airlineCarrierCode: 'AC ',
    airlineName: null
  }
];

export const MOCK_FLIGHTS3: FlightResponse[] = [
  {
    flightNumber: 872,
    scheduledDepartureDate: '2022-11-13',
    scheduledDepartureTime: '01:32:00',
    scheduledDepartureAirport: 'YYZ',
    scheduledArrivalDate: '2022-11-13',
    scheduledArrivalTime: '08:39:00',
    scheduledArrivalAirport: 'CDG',
    scheduledDepartureAirportCityName: 'Toronto',
    scheduledArrivalAirportCityName: 'Paris',
    isCancelledFlight: false,
    airlineCarrierCode: 'AC',
    airlineName: 'AirCanada'
  }
];

export const MOCK_FLIGHTS_4: FlightResponse[] = [
  {
    flightNumber: 56,
    scheduledDepartureDate: '2023-08-25T00:00:00+00:00',
    scheduledDepartureTime: '21:35:00',
    scheduledDepartureAirport: 'YYZ',
    scheduledArrivalDate: '2023-08-26T00:00:00+00:00',
    scheduledArrivalTime: '19:50:00',
    scheduledArrivalAirport: 'DXB',
    scheduledDepartureAirportCityName: 'Toronto',
    scheduledArrivalAirportCityName: 'Dubai',
    isCancelledFlight: false,
    airlineCarrierCode: 'AC ',
    airlineName: null
  }
];

export const MOCK_FLIGHTS_5: FlightResponse[] = [
  {
    flightNumber: 57,
    scheduledDepartureDate: '2023-09-06T00:00:00+00:00',
    scheduledDepartureTime: '02:00:00',
    scheduledDepartureAirport: 'DXB',
    scheduledArrivalDate: '2023-09-06T00:00:00+00:00',
    scheduledArrivalTime: '08:05:00',
    scheduledArrivalAirport: 'YYZ',
    scheduledDepartureAirportCityName: 'Dubai',
    scheduledArrivalAirportCityName: 'Toronto',
    isCancelledFlight: false,
    airlineCarrierCode: 'AC ',
    airlineName: null
  }
];

export const MOCK_FLIGHTS_ELIGIBLE: FlightResponse[] = [
  {
    airlineCarrierCode: 'AC ',
    airlineName: null,
    flightNumber: 7774,
    isCancelledFlight: false,
    scheduledArrivalAirport: 'YYZ',
    scheduledArrivalAirportCityName: 'Toronto',
    scheduledArrivalDate: '2023-11-30T00:00:00+00:00',
    scheduledArrivalTime: '01:55:00',
    scheduledDepartureAirport: 'YUL',
    scheduledDepartureAirportCityName: 'Montreal',
    scheduledDepartureDate: '2023-11-30T00:00:00+00:00',
    scheduledDepartureTime: '12:35:00'
  },
  {
    airlineCarrierCode: 'AC ',
    airlineName: null,
    flightNumber: 991,
    isCancelledFlight: false,
    scheduledArrivalAirport: 'MEX',
    scheduledArrivalAirportCityName: 'Mexico City',
    scheduledArrivalDate: '2023-11-30T00:00:00+00:00',
    scheduledArrivalTime: '12:20:00',
    scheduledDepartureAirport: 'YYZ',
    scheduledDepartureAirportCityName: 'Toronto',
    scheduledDepartureDate: '2023-11-30T00:00:00+00:00',
    scheduledDepartureTime: '07:55:00'
  }
];

export const MOCK_FLIGHTS_NOT_ELIGIBLE: FlightResponse[] = [
  {
    airlineCarrierCode: 'AC ',
    airlineName: null,
    flightNumber: 990,
    isCancelledFlight: false,
    scheduledArrivalAirport: 'YYZ',
    scheduledArrivalAirportCityName: 'Toronto',
    scheduledArrivalDate: '2023-11-26T00:00:00+00:00',
    scheduledArrivalTime: '19:15:00',
    scheduledDepartureAirport: 'MEX',
    scheduledDepartureAirportCityName: 'Mexico City',
    scheduledDepartureDate: '2023-11-26T00:00:00+00:00',
    scheduledDepartureTime: '13:35:00'
  },
  {
    airlineCarrierCode: 'AC ',
    airlineName: null,
    flightNumber: 428,
    isCancelledFlight: false,
    scheduledArrivalAirport: 'YUL',
    scheduledArrivalAirportCityName: 'Montreal',
    scheduledArrivalDate: '2023-11-26T00:00:00+00:00',
    scheduledArrivalTime: '22:50:00',
    scheduledDepartureAirport: 'YYZ',
    scheduledDepartureAirportCityName: 'Toronto',
    scheduledDepartureDate: '2023-11-26T00:00:00+00:00',
    scheduledDepartureTime: '21:30:00'
  }
];

export const MOCK_FLIGHTS_OUTSIDEAPPR: FlightResponse[] = [
  {
    airlineCarrierCode: 'LH ',
    airlineName: null,
    flightNumber: 921,
    isCancelledFlight: false,
    scheduledArrivalAirport: 'FRA',
    scheduledArrivalAirportCityName: 'Frankfurt',
    scheduledArrivalDate: '2023-01-05T00:00:00+00:00',
    scheduledArrivalTime: '09:05:00',
    scheduledDepartureAirport: 'LHR',
    scheduledDepartureAirportCityName: 'London',
    scheduledDepartureDate: '2023-01-05T00:00:00+00:00',
    scheduledDepartureTime: '06:30:00'
  },
  {
    airlineCarrierCode: 'LH ',
    airlineName: null,
    flightNumber: 6794,
    isCancelledFlight: false,
    scheduledArrivalAirport: 'YUL',
    scheduledArrivalAirportCityName: 'Montreal',
    scheduledArrivalDate: '2023-01-05T00:00:00+00:00',
    scheduledArrivalTime: '12:10:00',
    scheduledDepartureAirport: 'FRA',
    scheduledDepartureAirportCityName: 'Frankfurt',
    scheduledDepartureDate: '2023-01-05T00:00:00+00:00',
    scheduledDepartureTime: '10:05:00'
  },
  {
    airlineCarrierCode: 'LH ',
    airlineName: null,
    flightNumber: 6568,
    isCancelledFlight: false,
    scheduledArrivalAirport: 'YQB',
    scheduledArrivalAirportCityName: 'Quebec City',
    scheduledArrivalDate: '2023-01-05T00:00:00+00:00',
    scheduledArrivalTime: '14:23:00',
    scheduledDepartureAirport: 'YUL',
    scheduledDepartureAirportCityName: 'Montreal',
    scheduledDepartureDate: '2023-01-05T00:00:00+00:00',
    scheduledDepartureTime: '13:20:00'
  }
];

export const MOCK_FLIGHTS_UNABLE_DETERMINATION: FlightResponse[] = [
  {
    airlineCarrierCode: 'ZX ',
    airlineName: null,
    flightNumber: 1955,
    isCancelledFlight: false,
    scheduledArrivalAirport: 'YYZ',
    scheduledArrivalAirportCityName: 'Toronto',
    scheduledArrivalDate: '2023-03-15T00:00:00+00:00',
    scheduledArrivalTime: '18:09:00',
    scheduledDepartureAirport: 'YQB',
    scheduledDepartureAirportCityName: 'Quebec City',
    scheduledDepartureDate: '2023-03-15T00:00:00+00:00',
    scheduledDepartureTime: '16:25:00'
  },
  {
    airlineCarrierCode: 'AC ',
    airlineName: null,
    flightNumber: 854,
    isCancelledFlight: false,
    scheduledArrivalAirport: 'LHR',
    scheduledArrivalAirportCityName: 'London',
    scheduledArrivalDate: '2023-03-16T00:00:00+00:00',
    scheduledArrivalTime: '06:30:00',
    scheduledDepartureAirport: 'YYZ',
    scheduledDepartureAirportCityName: 'Toronto',
    scheduledDepartureDate: '2023-03-15T00:00:00+00:00',
    scheduledDepartureTime: '19:25:00'
  }
];
