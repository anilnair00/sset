import { DynamicsWebRequestResponse } from '../models/api-dynamics-web-request.interface';

export const MOCK_SUBMIT_CLAIMS_FAILED_RESPONSE: DynamicsWebRequestResponse = {
  originDestinations: [
    {
      arrivalAirportCode: 'YUL',
      departureAirportCode: 'CDG',
      flightDate: '2022-11-04T00:00:00+00:00',
      flightNumber: '871',
      isSuccessful: false,
      passengers: [],
      pnrNumber: null,
      ticketNumber: '0123458789123'
    },
    {
      arrivalAirportCode: 'YYZ',
      departureAirportCode: 'YUL',
      flightDate: '2022-11-04T00:00:00+00:00',
      flightNumber: '895',
      isSuccessful: false,
      passengers: [],
      pnrNumber: null,
      ticketNumber: '0123456789123'
    },
    {
      arrivalAirportCode: 'YYZ',
      departureAirportCode: 'CDG',
      flightDate: '2022-11-04T00:00:00+00:00',
      flightNumber: '873',
      isSuccessful: false,
      passengers: [],
      pnrNumber: null,
      ticketNumber: '0123456789123'
    }
  ],
  exceptionMessage: null,
  reCaptchaValidationResults: null,
  businessRuleValidationResults: null
};

export const MOCK_SUBMIT_CLAIMS_PARTIALLY_FAILED_RESPONSE: DynamicsWebRequestResponse =
  {
    originDestinations: [
      {
        arrivalAirportCode: 'YUL',
        departureAirportCode: 'CDG',
        flightDate: '2022-11-04T00:00:00+00:00',
        flightNumber: '871',
        isSuccessful: true,
        passengers: [],
        pnrNumber: null,
        ticketNumber: '0123456789123'
      },
      {
        arrivalAirportCode: 'YYZ',
        departureAirportCode: 'YUL',
        flightDate: '2022-11-04T00:00:00+00:00',
        flightNumber: '895',
        isSuccessful: false,
        passengers: [],
        pnrNumber: null,
        ticketNumber: '0123456789123'
      },
      {
        arrivalAirportCode: 'YYZ',
        departureAirportCode: 'CDG',
        flightDate: '2022-11-04T00:00:00+00:00',
        flightNumber: '873',
        isSuccessful: false,
        passengers: [],
        pnrNumber: null,
        ticketNumber: '0123456789123'
      }
    ],
    exceptionMessage: null,
    reCaptchaValidationResults: null,
    businessRuleValidationResults: null
  };

export const MOCK_SUBMIT_CLAIMS_RESPONSE: DynamicsWebRequestResponse = {
  originDestinations: [
    {
      arrivalAirportCode: 'YUL',
      departureAirportCode: 'CDG',
      flightDate: '2022-11-04T00:00:00+00:00',
      flightNumber: '871',
      isSuccessful: true,
      passengers: [],
      pnrNumber: null,
      ticketNumber: '0141234567890'
    },
    {
      arrivalAirportCode: 'YYZ',
      departureAirportCode: 'YUL',
      flightDate: '2022-11-04T00:00:00+00:00',
      flightNumber: '895',
      isSuccessful: true,
      passengers: [],
      pnrNumber: null,
      ticketNumber: '0141234567890'
    },
    {
      arrivalAirportCode: 'YYZ',
      departureAirportCode: 'CDG',
      flightDate: '2022-11-04T00:00:00+00:00',
      flightNumber: '873',
      isSuccessful: true,
      passengers: [],
      pnrNumber: null,
      ticketNumber: '0141234567890'
    }
  ],
  exceptionMessage: null,
  reCaptchaValidationResults: null,
  businessRuleValidationResults: null
};
