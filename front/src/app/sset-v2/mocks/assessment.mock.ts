import { GatewayResponse } from '../models/api-gateway.interface';
import * as MOCK_OD_LIST from './mock-eligibility.mock';

const MOCK_BASIC: GatewayResponse = {
  additionalPassengers: [],
  errorCode: null,
  errorMessage: null,
  originDestination: [],
  passenger: {
    firstName: 'JOHN',
    lastName: 'DOE',
    isPrimaryApplicant: true,
    ticketNumber: '0141234567890'
  },
  pnrNumber: 'BNFWUI',
  statusCode: 0,
  statusDescription: null,
  validationExceptions: null
};

export const MOCK_ASSESSMENT_DUPLICATED: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [MOCK_OD_LIST.MOCK_DUPLICATED]
};

export const MOCK_ASSESSMENT_ELIGIBLE_DISRUPTION: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [MOCK_OD_LIST.MOCK_ELIGIBLE_DISRUPTION],
  additionalPassengers: [
    {
      firstName: 'BRIANR',
      lastName: 'CHICKERING',
      isPrimaryApplicant: false,
      ticketNumber: '0141234567899'
    },
    {
      firstName: 'JACOB',
      lastName: 'BIGHAM',
      isPrimaryApplicant: false,
      ticketNumber: '0141234567891'
    },
    {
      firstName: 'JOHN',
      lastName: 'SMITH',
      isPrimaryApplicant: false,
      ticketNumber: '0141234567892'
    },
    {
      firstName: 'JANE',
      lastName: 'SMITH',
      isPrimaryApplicant: false,
      ticketNumber: '0141234567893'
    }
  ]
};

export const MOCK_ASSESSMENT_ELIGIBLE_NODISRUPTION: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [MOCK_OD_LIST.MOCK_ELIGIBLE_NODISRUPTION]
};

export const MOCK_ASSESSMENT_EXPENSE: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [MOCK_OD_LIST.MOCK_EXPENSE, MOCK_OD_LIST.MOCK_EXPENSE1],
  additionalPassengers: [
    {
      firstName: 'BRIANR',
      lastName: 'CHICKERING',
      isPrimaryApplicant: false,
      ticketNumber: '0141234567134'
    },
    {
      firstName: 'JACOB',
      lastName: 'BIGHAM',
      isPrimaryApplicant: false,
      ticketNumber: '0141234567891'
    },
    {
      firstName: 'JOHN',
      lastName: 'SMITH',
      isPrimaryApplicant: false,
      ticketNumber: '0141234567892'
    },
    {
      firstName: 'JOHN',
      lastName: 'SMITH',
      isPrimaryApplicant: false,
      ticketNumber: '0141234567893'
    },
    {
      firstName: 'JOHN',
      lastName: 'SMITH',
      isPrimaryApplicant: false,
      ticketNumber: '0141234567894'
    }
  ]
};

export const MOCK_ASSESSMENT_INCIDENT_ELIGIBLE: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [MOCK_OD_LIST.MOCK_INCIDENT_ELIGIBLE]
};

export const MOCK_ASSESSMENT_INCIDENT_NOTELIGIBLE: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [MOCK_OD_LIST.MOCK_INCIDENT_NOTELIGIBLE]
};

export const MOCK_ASSESSMENT_INCIDENT_PENDING: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [MOCK_OD_LIST.MOCK_INCIDENT_PENDING]
};

export const MOCK_ASSESSMENT_MULTI: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [
    MOCK_OD_LIST.MOCK_DUPLICATED,
    MOCK_OD_LIST.MOCK_ELIGIBLE_DISRUPTION,
    MOCK_OD_LIST.MOCK_ELIGIBLE_NODISRUPTION,
    MOCK_OD_LIST.MOCK_NODISRUPTION,
    MOCK_OD_LIST.MOCK_NOTELIGIBLE_DISRUPTION,
    MOCK_OD_LIST.MOCK_NOTELIGIBLE_NODISRUPTION,
    MOCK_OD_LIST.MOCK_OAL,
    MOCK_OD_LIST.MOCK_OUTSIDEAPPR,
    MOCK_OD_LIST.MOCK_OUTSIDEPERIOD,
    MOCK_OD_LIST.MOCK_OVER365,
    MOCK_OD_LIST.MOCK_PENDING_FUTURE,
    MOCK_OD_LIST.MOCK_PENDING,
    MOCK_OD_LIST.MOCK_UNABLE_DETERMINATION
  ]
};

export const MOCK_ASSESSMENT_NOCLAIM: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [
    MOCK_OD_LIST.MOCK_DUPLICATED,
    MOCK_OD_LIST.MOCK_NODISRUPTION,
    MOCK_OD_LIST.MOCK_OUTSIDEPERIOD,
    MOCK_OD_LIST.MOCK_OVER365,
    MOCK_OD_LIST.MOCK_PENDING_FUTURE,
    MOCK_OD_LIST.MOCK_PENDING
  ]
};

export const MOCK_ASSESSMENT_NOMATCH: GatewayResponse = {
  additionalPassengers: [],
  errorCode: 30,
  errorMessage: 'noMatch',
  originDestination: [],
  passenger: null,
  pnrNumber: null,
  statusCode: 0,
  statusDescription: null,
  validationExceptions: null
};

export const MOCK_ASSESSMENT_NODISRUPTION: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [MOCK_OD_LIST.MOCK_NODISRUPTION]
};

export const MOCK_ASSESSMENT_DOE: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [
    MOCK_OD_LIST.MOCK_NOTELIGIBLE,
    MOCK_OD_LIST.MOCK_ELIGIBLE_DISRUPTION
  ],
  additionalPassengers: [
    {
      firstName: 'JANE',
      lastName: 'DOE',
      isPrimaryApplicant: false,
      ticketNumber: '0141234567890'
    },
    {
      firstName: 'KEVIN',
      lastName: 'DOE',
      isPrimaryApplicant: false,
      ticketNumber: '0141234567891'
    },
    {
      firstName: 'EMILY',
      lastName: 'DOE',
      isPrimaryApplicant: false,
      ticketNumber: '0141234567892'
    },
    {
      firstName: 'RICHARD',
      lastName: 'DOE',
      isPrimaryApplicant: false,
      ticketNumber: '0141234567893'
    }
  ]
};

export const MOCK_ASSESSMENT_FRANKLIN: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [MOCK_OD_LIST.MOCK_DUPLICATED],
  passenger: {
    firstName: 'JAMES',
    lastName: 'FRANKLIN',
    isPrimaryApplicant: true,
    ticketNumber: '0141234567890'
  },
  additionalPassengers: [
    {
      firstName: 'MICHAEL',
      lastName: 'FRANKLIN',
      isPrimaryApplicant: false,
      ticketNumber: '0141234567891'
    }
  ]
};

export const MOCK_ASSESSMENT_MURPHY: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [
    MOCK_OD_LIST.MOCK_NODISRUPTION,
    MOCK_OD_LIST.MOCK_NODISRUPTION1
  ],
  passenger: {
    firstName: 'STEVE',
    lastName: 'MURPHY',
    isPrimaryApplicant: true,
    ticketNumber: '0141234567890'
  }
};

export const MOCK_ASSESSMENT_NOTELIGIBLE_DISRUPTION: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [MOCK_OD_LIST.MOCK_NOTELIGIBLE_DISRUPTION]
};

export const MOCK_ASSESSMENT_NOTELIGIBLE_NODISRUPTION: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [MOCK_OD_LIST.MOCK_NOTELIGIBLE_NODISRUPTION]
};

export const MOCK_ASSESSMENT_PENDING: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [
    MOCK_OD_LIST.MOCK_PENDING,
    MOCK_OD_LIST.MOCK_PENDING_FUTURE
  ]
};

export const MOCK_ASSESSMENT_OAL: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [MOCK_OD_LIST.MOCK_OAL]
};

export const MOCK_ASSESSMENT_OUTSIDEAPPR: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [
    MOCK_OD_LIST.MOCK_OUTSIDEAPPR,
    MOCK_OD_LIST.MOCK_UNABLE_DETERMINATION
  ],
  additionalPassengers: [
    {
      firstName: 'JANE',
      lastName: 'DOE',
      isPrimaryApplicant: false,
      ticketNumber: '0141234567890'
    },
    {
      firstName: 'KEVIN',
      lastName: 'DOE',
      isPrimaryApplicant: false,
      ticketNumber: '0141234567891'
    },
    {
      firstName: 'EMILY',
      lastName: 'DOE',
      isPrimaryApplicant: false,
      ticketNumber: '0141234567892'
    },
    {
      firstName: 'RICHARD',
      lastName: 'DOE',
      isPrimaryApplicant: false,
      ticketNumber: '0141234567893'
    }
  ]
};

export const MOCK_ASSESSMENT_OUTSIDEPERIOD: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [MOCK_OD_LIST.MOCK_OUTSIDEPERIOD]
};

export const MOCK_ASSESSMENT_OVER365: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [MOCK_OD_LIST.MOCK_OVER365]
};

export const MOCK_ASSESSMENT_UNABLE_DETERMINATION: GatewayResponse = {
  ...MOCK_BASIC,
  originDestination: [MOCK_OD_LIST.MOCK_UNABLE_DETERMINATION]
};

export const MOCK_ASSESSMENT_VALIDATION: GatewayResponse = {
  additionalPassengers: [],
  errorCode: 31,
  errorMessage: 'validationError',
  originDestination: null,
  passenger: null,
  pnrNumber: null,
  statusCode: 0,
  statusDescription: null,
  validationExceptions: [
    {
      propertyName: 'TicketNumber',
      businessRuleCode: 1020010
    },
    {
      propertyName: 'LastName',
      businessRuleCode: 1050010
    }
  ]
};
