Feature: Eligibility
  In order to determine if I should submit a claim
  As a passenger
  I need to verify if I'm eligible for a compensation 

@Eligibility
Scenario: PAX is eligible (10001) when travel delayed due to additional flight preparation time (TC 41289)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| MXEFZ3 | <null>       | 2020-02-07 | RICHARD   | BRYDSON  |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 10         | eligible          | 10001          | ca0a0408-8d4e-ea11-a94c-501ac53d8f44 | 009                  | <null>                          |

@Eligibility
Scenario: PAX is eligible (10001) when flight cancelled due to crew constraints (TC 41459)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName        |
		| UBEC37 | <null>       | 2020-03-26 | LEA       | BRENDANCLIFFORD |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 10         | eligible          | 10001          | 076494eb-3170-ea11-a94c-501ac53d8f46 | <null>               | FOC                             |

@Eligibility
Scenario: PAX is not eligible (11001) when travel does not meet minimum delay requirement (TC 41770)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName   |
		| JRDS4Z | <null>       | 2020-04-24 | SARALYNN  | CUNNINGHAM |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 20         | noDisruption      | 11001          | 215a3394-fc86-ea11-86e9-281878f6e6c7 | 063                  | <null>                          |

@Eligibility
Scenario: PAX is not eligible (11001) when Flight date entered is incorrect by 1 day (TC 43700)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName   |
		| JYPUEF | <null>       | 2020-03-18 | ANTOINE   | DESROSIERS |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 20         | noDisruption      | 11001          | a35e3eb6-fc6a-ea11-a94c-501ac53d8f46 | 086                  | <null>                          |

@Eligibility
Scenario: PAX is not eligible (11003) when travel delayed due to a technical issue with aircraft systems (TC 41291)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber  | FlightDate | FirstName | LastName |
		| <null> | 0142129841694 | 2020-03-21 | KEN       | CODD     |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 40         | notEligible       | 11003          | 3b142fde-266d-ea11-a94c-501ac53d8f46 | 043                  | <null>                          |

@Eligibility
Scenario: PAX is not eligible (11003) when First and last name contain only lower case letters (TC 43408)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| UQPYPI | <null>       | 2020-03-21 | ken       | codd     |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 40         | notEligible       | 11003          | 3b142fde-266d-ea11-a94c-501ac53d8f46 | 043                  | <null>                          |

@Eligibility
Scenario: PAX is not eligible (11003) when First and last name contain a mix of upper and lower case letters (TC 43408)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| UQPYPI | <null>       | 2020-03-21 | kEn       | coDD     |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 40         | notEligible       | 11003          | 3b142fde-266d-ea11-a94c-501ac53d8f46 | 043                  | <null>                          |

@Eligibility
Scenario: PAX is not eligible (11003) when First and last name contain accented/special characters (TC 43408)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| UQPYPI | <null>       | 2020-03-21 | Kén       | Cödd     |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 40         | notEligible       | 11003          | 3b142fde-266d-ea11-a94c-501ac53d8f46 | 043                  | <null>                          |

@Eligibility
Scenario: PAX is not eligible (11003) when First and last name contain spaces (TC 43408)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| UQPYPI | <null>       | 2020-03-21 | K en      | Co dd    |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 40         | notEligible       | 11003          | 3b142fde-266d-ea11-a94c-501ac53d8f46 | 043                  | <null>                          |

@Eligibility
Scenario: PAX is not eligible (11003) when First and last name contain hyphens (TC 43408)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| UQPYPI | <null>       | 2020-03-21 | K-en      | C-odd    |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 40         | notEligible       | 11003          | 3b142fde-266d-ea11-a94c-501ac53d8f46 | 043                  | <null>                          |

@Eligibility
Scenario: PAX is not eligible (11004) when flight cancelled due to weather conditions (TC 41778)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName      |
		| QKAGN5 | <null>       | 2020-02-28 | VANESA    | ISLAHERNANDEZ |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 40         | notEligible       | 11004          | 4b180675-fb5a-ea11-a94c-501ac53d8f44 | <null>               | WXX                             |

#@Eligibility
#Scenario: No Disruption (11005) when flight delay has been found but there is no delay at final destination (TC 41766)
#	Given the ODE:SSET keys are available from the Azure App Configuration Store
#	And a passenger fills the Self Serve Eligibility form
#		| PNR    | TicketNumber  | FlightDate | FirstName      | LastName |
#		| <null> | 0142130342400 | 2020-04-28 | CHINGCHUNGJOVI | YAU      |
#	When the passenger submits the form
#	Then the HTTP Status Code is Ok
#	And the EligibilityResponse is
#		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
#		| 20         | noDisruption      | 11005          | 58b0c90e-228a-ea11-86e9-281878f6e6c7 | 63                   | <null>                          |

#
#@Eligibility
#Scenario: PAX is not eligible (11007) when disruption took place before the protection period
#	Given the ODE:SSET keys are available from the Azure App Configuration Store
#	And a passenger fills the Self Serve Eligibility form
#		| PNR    | TicketNumber  | FlightDate | FirstName   | LastName     |
#		| <null> | 0143732443130 | 2019-12-08 | JOSEALBERTO | JOSE ALBERTO |
#	When the passenger submits the form
#	Then the HTTP Status Code is Ok
#	And the EligibilityResponse is
#		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
#		| 10         | eligible          | 10001          | 076494eb-3170-ea11-a94c-501ac53d8f46 | <null>               | FOC                             |
#
@Eligibility
Scenario: No Disruption (11006) when no flight delay found (TC 41768)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| Q7MQQG | <null>       | 2020-03-19 | STEPHEN   | MILLER   |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 20         | noDisruption      | 11006          | cf713eb6-fc6a-ea11-a94c-501ac53d8f46 | 086                  | <null>                          |

@Eligibility
Scenario: PAX is not eligible (70002) when flight disruption falls outside APPR regulation (TC 41551)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName  |
		| SR45WA | <null>       | 2019-12-22 | KENNETH   | SCHNEIDER |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 90         | outsideAppr       | 70002          | 25e9d307-6e31-ea11-a601-501ac53d650e | <null>               | <null>                          |

@Eligibility
Scenario: No Disruption (11001): Does not meet minimum delay requirement - 2 ODs on same day (TC 39209)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber  | FlightDate | FirstName | LastName |
		| <null> | 0143732801520 | 2020-01-15 | REEM      | SORIAL   |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 20         | noDisruption      | 11001          | 7e7b302d-6738-ea11-a601-501ac53d650e | 43                   | <null>                          |

@Eligibility
Scenario: No Match : Incorrect first and last names (TC 43386)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| UWH2CO | <null>       | 2019-12-21 | YI        | FLAGG    |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 30         | noMatch           | <null>         | <null>               | <null>               | <null>                          |

@Eligibility
Scenario: No Match : Incorrect flight date (TC 43697)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName   |
		| JYPUEF | <null>       | 2020-01-01 | ANTOINE   | DESROSIERS |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 30         | noMatch           | <null>         | <null>               | <null>               | <null>                          |

@Eligibility
Scenario: No Match 9XXX : Need more information (TC 42182)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| UBEC37 | <null>       | 2020-01-01 | JOHN      | WICK     |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 30         | noMatch           | <null>         | <null>               | <null>               | <null>                          |

@Eligibility
Scenario: Not Eligible 11004 : Disruption due to safety reasons (Two ODs with different eligibility codes on same day) (TC 42178)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName        | LastName |
		| VOXXWO | <null>       | 2020-02-07 | SUSANMARYJACKSON | MCLEAN   |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 40         | notEligible       | 11004          | ad5e28db-354f-ea11-a94c-501ac53d8f44 | 87                   | <null>                          |

@Eligibility
Scenario: Pending 20001 : Flights still being evaluated - Waiting period expired and needs investigation (TC 42206)
	#Note that for these test cases the data may change as time passes. If data is no longer accurate contact Roman to get another sample
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName  |
		| VFZJRL | <null>       | 2020-05-13 | RONALD    | MACLENNAN |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 50         | pending           | 20003          | 76f3756a-ea95-ea11-86e9-281878f6e6c7 | <null>               | <null>                          |

@Eligibility
Scenario: Pending 20003 : Reason code not set after 3 day waiting period expired (TC 42597)
	#Note that for these test cases the data may change as time passes. If data is no longer accurate contact Roman to get another sample
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName   |
		| L79LML | <null>       | 2020-05-19 | YONATHAN  | WEINBERGER |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 50         | pending           | 20003          | eb6c9057-6a9b-ea11-86e9-281878f6e6c7 | <null>               | <null>                          |
#
#@Eligibility
#Scenario: Pending 20004 : Reason code not set before 3 day waiting period after flight disruption (TC 42585)
#	#Note that for these test cases the data may change as time passes. If data is no longer accurate contact Roman to get another sample
#	Given the ODE:SSET keys are available from the Azure App Configuration Store
#	And a passenger fills the Self Serve Eligibility form
#		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
#		| QAY2VT | <null>       | 2020-05-24 | RUOYU     | WANG     |
#	When the passenger submits the form
#	Then the HTTP Status Code is Ok
#	And the EligibilityResponse is
#		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
#		| 50         | pending           | 20004          | 239e5d15-6a9b-ea11-86e9-281878f6e6c7 | <null>               | SOP                             |
#@Eligibility
#Scenario: Not Eligible 11002 : Disruption was over 1 year ago (TC 42208)
#	#Note: To run this test successfully, the FD API code must be hacked (see TC 42208)
#	Given the ODE:SSET keys are available from the Azure App Configuration Store
#	And a passenger fills the Self Serve Eligibility form
#		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
#		| UWH2CO | <null>       | 2019-12-21 | ALEXANDRE | GROS     |
#	When the passenger submits the form
#	Then the HTTP Status Code is Ok
#	And the EligibilityResponse is
#		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
#		| 70         | over365           | 11002          | <null>               | <null>               | <null>                          |

@Eligibility
Scenario: Other Airlines 80003 : Need more information - Other carriers found (TC 42184)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber  | FlightDate | FirstName | LastName |
		| <null> | 0162312095372 | 2020-05-01 | LAURIE    | FORTIN   |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 80         | otherAirlines     | 80003          | <null>               | <null>               | <null>                          |

@Eligibility
Scenario: Other Airlines 80003: Departing from New Delhi on December 15 2019 (TC 41473)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| MOELKR | <null>       | 2019-12-15 | RAJAN     | SIKRI    |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 80         | otherAirlines     | 80003          | <null>               | <null>               | <null>                          |

@Eligibility
Scenario: Other Airlines 80004 : Cancellation found and needs to be verified (TC 43691)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| MXEFZ3 | <null>       | 2020-02-09 | RICHARD   | BRYDSON  |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 80         | otherAirlines     | 80004          | <null>               | <null>               | <null>                          |

@Eligibility
Scenario: Other Airlines 80004 : Cancellation found on AC flight but flight with other carrier present in snapshot (TC 43585)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| TUS3JT | <null>       | 2020-02-14 | STEWART   | POLSKY   |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 80         | otherAirlines     | 80004          | <null>               | <null>               | <null>                          |

@Eligibility
Scenario: Outside APPR 70002: Flight disruption falls outside APPR regulation (Single Pax + Grouped) (TC 44041)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| WZBTH6 | <null>       | 2019-12-28 | GIUSEPPE  | DI CARLO |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 90         | outsideAppr       | 70002          | c8bd0a08-6e31-ea11-a601-501ac53d650e | <null>               | <null>                          |

@Eligibility
Scenario: No Match : Request is made using a group PNR/Booking (TC 44039)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName  | LastName   |
		| TEWFS4 | <null>       | 2019-12-21 | SKIFRANCIS | SKIFRANCIS |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 30         | noMatch           | <null>         | <null>               | <null>               | <null>                          |

@Eligibility
Scenario: No Disruption : Passenger info was not found in snapshot - PNR contains multiple itinerary (TC 45432)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| RNQAKZ | <null>       | 2020-02-10 | JOSHUA    | HUGHES   |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId                 | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 20         | noDisruption      | 11006          | b19f16ef-3854-ea11-a94c-501ac53d8f44 | 85                   | <null>                          |

@Eligibility
Scenario: No Match : Passenger entered dashes and apostrophes as first and last name (TC 45500)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName   | LastName     |
		| MXEFZ3 | <null>       | 2020-02-07 | ----------- | '-'-'-'-'-'- |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the EligibilityResponse is
		| StatusCode | StatusDescription | DisruptionCode | MostSignificantLegId | ArrivalDelayIATACode | SecondaryCancellationReasonCode |
		| 30         | noMatch           | <null>         | <null>               | <null>               | <null>                          |
