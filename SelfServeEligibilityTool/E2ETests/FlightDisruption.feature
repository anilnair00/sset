Feature: FlightDisruption
  In order to verify that I am eligible for a compensation
  As a passenger
  I need to retrieve the eligibility and compensation assessment for my itinerary

@FlightDisruption
Scenario: Causality Logic - Identify the appropriate MSL when two different ODs occur on the same day (TC 42605)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName        | LastName | PNR    | TicketNumber | SnapshotAdvanceDays |
		| AC      | 446          | 2020-02-07    | YYZ              | YOW            | SUSANMARYJACKSON | MCLEAN   | VOXXWO | <null>       | <null>              |
	When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
	And the most significant leg id is '646328db-354f-ea11-a94c-501ac53d8f44'

@FlightDisruption
Scenario: Causality Logic - Identify the appropriate MSL when a connection is missed due to delay of previous flight (Time overlap) (TC 42607)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName | PNR    | TicketNumber | SnapshotAdvanceDays |
		| QK      | 8322         | 2020-01-16    | YAM              | YYZ            | RANDI     | CONDIE   | SR7WA9 | <null>       | <null>              |
	When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
	And the most significant leg id is 'c96f8fe4-3039-ea11-a601-501ac53d650e'

@FlightDisruption
Scenario: Causality Logic - Identify the appropriate MSL when PAX is rebooked on a later flight due to large delay on original flight (TC 42609)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName | PNR    | TicketNumber | SnapshotAdvanceDays |
		| AC      | 442          | 2020-03-13    | YYZ              | YOW            | LISAMARIE | GAUTHIER | JYLKZ7 | <null>       | <null>              |
	When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
	And the most significant leg id is 'd37fea33-0f6a-ea11-a94c-501ac53d8f46'

@FlightDisruption
Scenario: Causality Logic - Identify the appropriate MSL for a roundtrip happening on different dates (TC 42611)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName        | LastName | PNR    | TicketNumber  | SnapshotAdvanceDays |
		| QK      | 8809         | 2020-01-04    | YQY              | YHZ            | JENNIFERPATRICIA | KING     | <null> | 0149461096776 | <null>              |
	When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
	And the most significant leg id is '25812e08-6e31-ea11-a601-501ac53d650e'

@FlightDisruption
Scenario: Causality Logic - Identify the appropriate MSL when the pax has been rebooked but original flight does not appear in the actuals table (TC 42615)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName | PNR    | TicketNumber  | SnapshotAdvanceDays |
		| AC      | 469          | 2019-12-18    | YOW              | YYZ            | ISABELLA  | CARLYLE  | TKM2UK | <null>        | <null>              |
	When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
	And the most significant leg id is '65e6cc51-9122-ea11-a601-501ac53d650e'

@FlightDisruption
Scenario: Causality Logic - Identify the appropriate MSL when first flight is cancelled (TC 42710)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName | PNR    | TicketNumber  | SnapshotAdvanceDays |
		| QK      | 8612         | 2019-12-27    | YSB              | YYZ            | ALEXANDER | BOYNE    | TFSJ54 | <null>        | <null>              |
	When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
	And the most significant leg id is '0937d8fa-6d31-ea11-a601-501ac53d650e'

@FlightDisruption
Scenario: Assessment  - 10001 Eligible - Delayed to accommodate late arriving customers (TC 44941)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName | PNR    | TicketNumber | SnapshotAdvanceDays |
		| QK      | 8878         | 2020-02-27    | YHZ              | YQX            | ALLIE     | MORRISON | WG8QAK | <null>       | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility              | MostSignificantLegId                 | DelayIataCode | SecondaryCancellationReasonCode |
		| 10001                        | flightAndPaxFoundEligibleControllable | 9b94fb67-495a-ea11-a94c-501ac53d8f44 | 15            | <null>                          |

@FlightDisruption
Scenario: Assessment  - 10001 Eligible - Cancelled due to crew constraints (TC 44943)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName | PNR    | TicketNumber | SnapshotAdvanceDays |
		| ZX      | 7784         | 2020-02-10    | YQX              | YYT            | MYLESGARY | COLLINS  | SY5AJS | <null>       | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility              | MostSignificantLegId                 | DelayIataCode | SecondaryCancellationReasonCode |
		| 10001                        | flightAndPaxFoundEligibleControllable | 978c15b8-3854-ea11-a94c-501ac53d8f44 | <null>        | FOC                             |

@FlightDisruption
Scenario: Assessment  - 10001 Eligible - Delayed due to crew availability (TC 44946)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName | PNR    | TicketNumber  | SnapshotAdvanceDays |
		| QK      | 8322         | 2020-01-16    | YAM              | YYZ            | JILL      | CONDIE   | <null> | 0142125009538 | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility              | MostSignificantLegId                 | DelayIataCode | SecondaryCancellationReasonCode |
		| 10001                        | flightAndPaxFoundEligibleControllable | c96f8fe4-3039-ea11-a601-501ac53d650e | 64            | <null>                          |

@FlightDisruption
Scenario: Assessment - 11001 Not Eligible - Does not meet minimum delay requirement (TC 44948)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName    | LastName | PNR    | TicketNumber  | SnapshotAdvanceDays |
		| AC      | 123          | 2020-05-23    | YYZ              | YVR            | SHAWNEDWARDE | MARTIN   | <null> | 0142130575223 | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                           | MostSignificantLegId                 | DelayIataCode | SecondaryCancellationReasonCode |
		| 11001                        | flightAndPaxFoundNotEligibleMinimumDelayNotReached | d9de39ea-8e9e-ea11-96d2-281878f6de3c | 63            | <null>                          |

@FlightDisruption
Scenario: Assessment  - 11003 Not Eligible - Delayed due to a technical issue with aircraft systems (TC 44952)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName | PNR    | TicketNumber | SnapshotAdvanceDays |
		| AC      | 481          | 2020-01-19    | YUL              | YYZ            | DIANE     | JACQUES  | K3F7LZ | <null>       | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility           | MostSignificantLegId                 | DelayIataCode | SecondaryCancellationReasonCode |
		| 11003                        | flightAndPaxFoundNotEligibleSafety | 6328ad2c-8d3b-ea11-a601-501ac53d650e | 43            | <null>                          |

@FlightDisruption
Scenario: Assessment  - 11004 Not Eligible - Cancelled flight due to weather (TC 44954)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName | PNR    | TicketNumber  | SnapshotAdvanceDays |
		| AC      | 1401         | 2020-01-25    | HUX              | YYZ            | ROXANE    | STANNERS | <null> | 0142122502982 | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                   | MostSignificantLegId                 | DelayIataCode | SecondaryCancellationReasonCode |
		| 11004                        | flightAndPaxFoundNotEligibleUncontrollable | 32fc617f-bb40-ea11-a601-501ac53d650e | <null>        | WXX                             |

@FlightDisruption
Scenario: Assessment  - 11005 Not Eligible - Delay was found but no delay at arrival (TC 44957)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName       | LastName | PNR    | TicketNumber | SnapshotAdvanceDays |
		| AC      | 689          | 2020-05-19    | YYT              | YYZ            | BRADLEYREGINALD | PEDDLE   | POA5T8 | <null>       | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                                       | MostSignificantLegId                 | DelayIataCode | SecondaryCancellationReasonCode |
		| 11005                        | flightAndPaxFoundNotEligibleNoDelayAtArrivalWithDelayOnFlights | a51abb68-a29a-ea11-86e9-281878f6e6c7 | 88            | <null>                          |

@FlightDisruption
Scenario: Assessment  - 11006 Not Eligible - No flight delay was found (TC 44959)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName | PNR    | TicketNumber | SnapshotAdvanceDays |
		| AC      | 8501         | 2020-05-22    | YFC              | YUL            | MARC      | BREAU    | NUN5CD | <null>       | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                                     | MostSignificantLegId                 | DelayIataCode | SecondaryCancellationReasonCode |
		| 11006                        | flightAndPaxFoundNotEligibleNoDelayAtArrivalNoDelayOnFlights | 32ac9441-349c-ea11-86e9-501ac53d0855 | <null>        | <null>                          |

@FlightDisruption
Scenario: Assessment  - 11007 Not Eligible - Flight date takes place before regulation enforcement (TC 44963)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName | PNR    | TicketNumber  | SnapshotAdvanceDays |
		| AC      | 147          | 2019-12-08    | YYZ              | YYC            | HELEN     | HARRISON | NIVDDR | <null>        | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                         | MostSignificantLegId | DelayIataCode | SecondaryCancellationReasonCode |
		| 11007                        | notEligibleFlightDateBeforeRegulationEnforcement | <null>               | <null>        | <null>                          |

@FlightDisruption
Scenario: Assessment  - 70002 Not Eligible - Flight disruption falls outside APPR regulation (TC 45004)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName | PNR    | TicketNumber  | SnapshotAdvanceDays |
		| AC      | 7041         | 2020-03-03    | EWR              | TPA            | GIUSEPPE  | DICARLO  | WUNJ4S | <null>        | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                                 | MostSignificantLegId                 | DelayIataCode | SecondaryCancellationReasonCode |
		| 70002                        | flightAndPaxFoundNotDeterminableRegulationIsNotAutomated | 77d400df-365e-ea11-a94c-501ac53d8f46 | 9             | <null>                          |

@FlightDisruption
Scenario: Assessment  - 80001 Missing Information - Routes don't match (TC 45008)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName        | LastName | PNR    | TicketNumber | SnapshotAdvanceDays |
		| QK      | 8474         | 2020-03-20    | YCG              | YYC            | SEBASTIENBRIDEAU | MATTON   | TPBIH8 | <null>       | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility     | MostSignificantLegId | DelayIataCode | SecondaryCancellationReasonCode |
		| 80001                        | notProcessedRoutesDoNotMatch | <null>               | <null>        | <null>                          |

@FlightDisruption
Scenario: Assessment  - 80002 Missing Information - Routes do not match. Cancellations found and need to be verified (TC 45010)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName | PNR    | TicketNumber  | SnapshotAdvanceDays |
		| AC      | 459          | 2020-04-13    | YOW              | YYZ            | DOMINIC   | FLYNN    | <null> | 0142128811793 | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                         | MostSignificantLegId | DelayIataCode | SecondaryCancellationReasonCode |
		| 80002                        | notProcessedRoutesDoNotMatchPossibleCancellation | <null>               | <null>        | <null>                          |

@FlightDisruption
Scenario: Assessment  - 80003 Out Of Scope - Not processed. Other carrier flight(s) found. Verify other carrier flight(s).  (TC 45015)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName       | PNR    | TicketNumber  | SnapshotAdvanceDays |
		| UA      | 8897         | 2020-06-15    | BLR              | FRA            | KRISHNAN  | KRISHNAMOORTHY | KNSLV9 | <null>        | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                  | MostSignificantLegId | DelayIataCode | SecondaryCancellationReasonCode |
		| 80003                        | notProcessedRoutesHaveOtherCarrierFlights | <null>               | <null>        | <null>                          |

@FlightDisruption
Scenario: Assessment  - 90101 Missing Information - Flight information not found in Snapshot data and Actual Flights data. (TC 45031)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName | PNR    | TicketNumber | SnapshotAdvanceDays |
		| AC      | 103          | 2020-05-18    | YYZ              | YVR            | JASON     | TUCKETT  | VNKOIW | <null>       | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                                                     | MostSignificantLegId | DelayIataCode | SecondaryCancellationReasonCode |
		| 90101                        | notProcessedSnapFlightNotFoundSnapPaxFoundActualFlightNotFoundActualPaxFound | <null>               | <null>        | <null>                          |

@FlightDisruption
Scenario: Assessment  - 90111 Missing Information - Flight information not found in Snapshot data (TC 45116)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName | PNR    | TicketNumber | SnapshotAdvanceDays |
		| QK      | 8333         | 2020-03-14    | YWG              | YYC            | JANETE    | SMITH    | TD983R | <null>       | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                                                  | MostSignificantLegId | DelayIataCode | SecondaryCancellationReasonCode |
		| 90111                        | notProcessedSnapFlightNotFoundSnapPaxFoundActualFlightFoundActualPaxFound | <null>               | <null>        | <null>                          |

@FlightDisruption
Scenario: Assessment  - 91001 Missing Information - Passenger information not found in Snapshot data. Flight information not found in Actual Flights data (TC 45120)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName      | LastName       | PNR    | TicketNumber  | SnapshotAdvanceDays |
		| AI      | 915          | 2020-02-19    | DEL              | DXB            | BALJINDERSINGH | BALJINDERSINGH | <null> | 0143676358465 | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                                                     | MostSignificantLegId | DelayIataCode | SecondaryCancellationReasonCode |
		| 91001                        | notProcessedSnapFlightFoundSnapPaxNotFoundActualFlightNotFoundActualPaxFound | <null>               | <null>        | <null>                          |

@FlightDisruption
Scenario: Assessment  - 91010 Missing Information -  Passenger information not found in Snapshot data and Actual Flights data (TC 45124)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName         | LastName          | PNR    | TicketNumber | SnapshotAdvanceDays |
		| AC      | 7041         | 2019-12-28    | TPA              | FLL            | MONTREALCANADIENS | MONTREALCANADIENS | WZBTH6 | <null>       | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                                                     | MostSignificantLegId | DelayIataCode | SecondaryCancellationReasonCode |
		| 91010                        | notProcessedSnapFlightFoundSnapPaxNotFoundActualFlightFoundActualPaxNotFound | <null>               | <null>        | <null>                          |

@FlightDisruption
Scenario: Assessment  - 80003 Out Of Scope - Not processed. Other carrier flight(s) found. Verify other carrier flight(s) - 3 day snapshot (TC 45150)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName        | PNR    | TicketNumber | SnapshotAdvanceDays |
		| LH      | 1112         | 2020-03-25    | FRA              | MAD            | CLAUDIA   | CASADO CARRASCO | AME38R | <null>       | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                  | MostSignificantLegId | DelayIataCode | SecondaryCancellationReasonCode |
		| 80003                        | notProcessedRoutesHaveOtherCarrierFlights | <null>               | <null>        | <null>                          |

@FlightDisruption
Scenario: Assessment  - 80003 Out Of Scope - Other Airlines - Booking has ODs with different protection periods (TC 45152)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName       | LastName | PNR    | TicketNumber | SnapshotAdvanceDays |
		| ZX      | 1981         | 2020-03-29    | MEX              | YYZ            | CHARLOTTELOUISE | FRIIS    | MWQIKH | <null>       | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                  | MostSignificantLegId | DelayIataCode | SecondaryCancellationReasonCode |
		| 80003                        | notProcessedRoutesHaveOtherCarrierFlights | <null>               | <null>        | <null>                          |

@FlightDisruption
Scenario: Assessment  - 20003 Pending - Reason code not set. 3 days waiting period expired. Investigation necessary (TC 45154)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName   | PNR    | TicketNumber | SnapshotAdvanceDays |
		| AC      | 8830         | 2020-05-19    | YYZ              | YUL            | YONATHAN  | WEINBERGER | L79LML | <null>       | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                          | MostSignificantLegId                 | DelayIataCode | SecondaryCancellationReasonCode |
		| 20003                        | flightAndPaxFoundNotDeterminableReasonNotYetKnown | eb6c9057-6a9b-ea11-86e9-281878f6e6c7 | <null>        | <null>                          |

#@FlightDisruption
#Scenario: Assessment  - 20004 Pending - Reason code not set. Please wait 3 days after flight disruption.  (TC 45156)
#  #Note: This test will not be valid after June 23rd, 2020
#  Given the ODE:SSET keys are available from the Azure App Configuration Store
#  And The key 'ODE:CIP:Settings:Server:URL'
#	And the Assessment Request
#		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName   | LastName | PNR    | TicketNumber | SnapshotAdvanceDays |
#		| AF      | 379          | 2020-06-22    | YVR              | CDG            | JAMESDONALD | STEWART  | M6WSJR | <null>       | <null>              |
#  When I submit the request to the flight disruption API
#  Then the HTTP Status Code is Ok
#  And the FdResponse is
#		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                      | MostSignificantLegId | DelayIataCode | SecondaryCancellationReasonCode |
#		| 20004                        | flightAndPaxFoundNotDeterminableReasonPending | <null>               | <null>        | <null>                          |

#@FlightDisruption
#Scenario: Assessment - 11002 Not Eligible - Disruption was over 1 year ago (TC 45227)
#  #Note: to run successfully, the code has to be hacked to replace the 365-day rule by 60-day.
#  Given the ODE:SSET keys are available from the Azure App Configuration Store
#  And The key 'ODE:CIP:Settings:Server:URL'
#	And the Assessment Request
#		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName | PNR    | TicketNumber | SnapshotAdvanceDays |
#		| QK      | 8308         | 2019-12-17    | YQQ              | YVR            | SARAH     | MASCH    | AD78FA | <null>       | <null>              |
#  When I submit the request to the flight disruption API
#  Then the HTTP Status Code is Ok
#  And the FdResponse is
#		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                     | MostSignificantLegId | DelayIataCode | SecondaryCancellationReasonCode |
#		| 11002                        | flightAndPaxFoundNotEligibleFlightDateTooOld | <null>               | <null>        | <null>                          |

#@FlightDisruption
#Scenario: Assessment  - 70003 Not Eligible - Flight disruption falls outside APPR regulation - Future Flight (TC 45241)
#  #Note: This test will not be valid after July 1st, 2020
#  Given the ODE:SSET keys are available from the Azure App Configuration Store
#  And The key 'ODE:CIP:Settings:Server:URL'
#	And the Assessment Request
#		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName | PNR    | TicketNumber | SnapshotAdvanceDays |
#		| NH      | 6821         | 2020-07-02    | YYZ              | HND            | JINGRONG  | ZHANG    | VLXBBQ | <null>       | <null>              |
#  When I submit the request to the flight disruption API
#  Then the HTTP Status Code is Ok
#  And the FdResponse is
#		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                             | MostSignificantLegId | DelayIataCode | SecondaryCancellationReasonCode |
#		| 70003                        | flightAndPaxFoundFutureFlightOutsideProtectionPeriod | <null>               | <null>        | <null>                          |

#@FlightDisruption
#Scenario: Assessment  - 20004 Pending - Validate that pending response is returned for in progress OD (TC 45243)
#  #Note: This test will not be valid after June 25th, 2020
#  Given the ODE:SSET keys are available from the Azure App Configuration Store
#  And The key 'ODE:CIP:Settings:Server:URL'
#	And the Assessment Request
#		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName | LastName | PNR    | TicketNumber | SnapshotAdvanceDays |
#		| AC      | 7910         | 2020-06-25    | YUL              | EWR            | NASTYA    | KASSIR   | NBBU7R | <null>       | <null>              |
#  When I submit the request to the flight disruption API
#  Then the HTTP Status Code is Ok
#  And the FdResponse is
#		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                      | MostSignificantLegId | DelayIataCode | SecondaryCancellationReasonCode |
#		| 20004                        | flightAndPaxFoundNotDeterminableReasonPending | <null>               | <null>        | <null>                          |

@FlightDisruption
Scenario: Assessment  - 80004 Out Of Scope - Not processed. Other carrier flight(s) found. Cancellations found and need to be verified. (TC 45018)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName       | LastName | PNR    | TicketNumber | SnapshotAdvanceDays |
		| ZX      | 7685         | 2020-02-26    | YUL              | IAH            | ALEXANDREWALTER | BUSWELL  | UMZT5T | <null>       | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                                         | MostSignificantLegId | DelayIataCode | SecondaryCancellationReasonCode |
		| 80004                        | notProcessedRoutesHaveOtherCarrierFlightsAndPossibleCancellation | <null>               | <null>        | <null>                          |

@FlightDisruption
Scenario: Assessment  - 91100 Missing Information - Flight information and passenger information not found in Actual Flights data (TC 45128)
  Given the ODE:SSET keys are available from the Azure App Configuration Store
  And The key 'ODE:CIP:Settings:Server:URL'
	And the Assessment Request
		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName   | LastName      | PNR    | TicketNumber | SnapshotAdvanceDays |
		| AC      | 857          | 2020-04-15    | LHR              | YYZ            | BRIANALFRED | BRIAN ALFRED  | TIIKYE | <null>       | <null>              |
  When I submit the request to the flight disruption API
  Then the HTTP Status Code is Ok
  And the FdResponse is
		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                                                     | MostSignificantLegId | DelayIataCode | SecondaryCancellationReasonCode |
		| 91100                        | notProcessedSnapFlightFoundSnapPaxFoundActualFlightNotFoundActualPaxNotFound | <null>               | <null>        | <null>                          |

#@FlightDisruption
#Scenario: Assessment  - 70003 Not Eligible - Greatest flight date is more than 24hrs from initial departure (TC 45596)
#  #Note: this TC is working as expected on 2020-07-10 14:30 but will not be valid after 2020-07-11
#  Given the ODE:SSET keys are available from the Azure App Configuration Store
#  And The key 'ODE:CIP:Settings:Server:URL'
#	And the Assessment Request
#		| Airline | FlightNumber | DepartureDate | DepartureAirport | ArrivalAirport | FirstName        | LastName | PNR    | TicketNumber | SnapshotAdvanceDays |
#		| QK      | 8413         | 2020-07-10    | YLW              | YVR            | STEFANIAGIUDITTA | GANZ     | KUZOCB | <null>       | <null>              |
#  When I submit the request to the flight disruption API
#  Then the HTTP Status Code is Ok
#  And the FdResponse is
#		| MatchAndClaimEligibilityCode | MatchAndClaimEligibility                             | MostSignificantLegId | DelayIataCode | SecondaryCancellationReasonCode |
#		| 70003                        | flightAndPaxFoundFutureFlightOutsideProtectionPeriod | <null>               | <null>        | <null>                          |
