Feature: SnapshotSearch
  In order to verify that I am eligible for a compensation
  As a passenger
  I need to retrieve the protection on record for my itinerary

@snapshotSearch
Scenario: Search for one way non-stop domestic flight for a single passenger by PNR (TC 39203)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName     | LastName |
		| LP3OFR | <null>       | 2020-04-05 | LAIPINGFILONA | LEE      |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the snapshot list has 01 item(s)
	And the weight of item 01 from the snapshot list is 38
	And the weighting of item 01 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| true             | true            | false                   | false                  | true                      | true                     | true                          | false                              | true                        | false                            | false               |
	And the PassengerOriginDestination of item 01 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName     | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| 75851195-5578-ea11-a94c-501ac53d8f46 | LP3OFR | 2020-04-04          | 3                | 0142130112351 | AC                   | 692                   | AC          | 692          | YYZ              | YYT            | 0001-01-01T00:00:00+00:00 | 2020-04-05T08:30:00-04:00 | 0001-01-01T00:00:00+00:00 | 2020-04-05T13:00:00-02:30 | LAIPINGFILONA | LEE      | <null>            | <null>             | <null>           |

@snapshotSearch
Scenario: Search for one way non-stop domestic flight with multiple passengers by PNR (TC 39294)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| MB2A6Q | <null>       | 2020-01-15 | NATALEE   | LEWIS    |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the snapshot list has 02 item(s)
	And the weight of item 01 from the snapshot list is 16
	And the weight of item 02 from the snapshot list is 38
	And the weighting of item 01 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| false            | false           | false                   | false                  | false                     | false                    | true                          | false                              | true                        | false                            | false               |
	And the PassengerOriginDestination of item 01 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| ea7bda96-722d-ea11-a601-501ac53d3af5 | MB2A6Q | 2019-12-18          | 14               | 0149432836782 | AC                   | 415                   | AC          | 415          | YUL              | YYZ            | 0001-01-01T00:00:00+00:00 | 2020-01-15T14:00:00-05:00 | 0001-01-01T00:00:00+00:00 | 2020-01-15T15:30:00-05:00 | JESSE     | CAMPEAU  | <null>            | <null>             | <null>           |
	And the weighting of item 02 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| true             | true            | false                   | false                  | true                      | true                     | true                          | false                              | true                        | false                            | false               |
	And the PassengerOriginDestination of item 02 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| ea7bda96-722d-ea11-a601-501ac53d3af5 | MB2A6Q | 2019-12-18          | 14               | 0149432836783 | AC                   | 415                   | AC          | 415          | YUL              | YYZ            | 0001-01-01T00:00:00+00:00 | 2020-01-15T14:00:00-05:00 | 0001-01-01T00:00:00+00:00 | 2020-01-15T15:30:00-05:00 | NATALEE   | LEWIS    | <null>            | <null>             | <null>           |
	And the PassengerOriginDestinationCorrelationId with the highest weight is '3595c75f-752d-ea11-a601-501ac53d3af5'

@snapshotSearch
Scenario: Search for one way non-stop domestic flight with multiple passengers by Ticket # (TC 41255)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber  | FlightDate | FirstName | LastName |
		| <null> | 0149432836782 | 2020-01-15 | JESSE     | CAMPEAU  |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the snapshot list has 02 item(s)
	And the weight of item 01 from the snapshot list is 51
	And the weight of item 02 from the snapshot list is 16
	And the weighting of item 01 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| true             | true            | false                   | false                  | true                      | true                     | true                          | false                              | true                        | false                            | true                |
	And the PassengerOriginDestination of item 01 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| ea7bda96-722d-ea11-a601-501ac53d3af5 | MB2A6Q | 2019-12-18          | 14               | 0149432836782 | AC                   | 415                   | AC          | 415          | YUL              | YYZ            | 0001-01-01T00:00:00+00:00 | 2020-01-15T14:00:00-05:00 | 0001-01-01T00:00:00+00:00 | 2020-01-15T15:30:00-05:00 | JESSE     | CAMPEAU  | <null>            | <null>             | <null>           |
	And the weighting of item 02 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| false            | false           | false                   | false                  | false                     | false                    | true                          | false                              | true                        | false                            | false               |
	And the PassengerOriginDestination of item 02 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| ea7bda96-722d-ea11-a601-501ac53d3af5 | MB2A6Q | 2019-12-18          | 14               | 0149432836783 | AC                   | 415                   | AC          | 415          | YUL              | YYZ            | 0001-01-01T00:00:00+00:00 | 2020-01-15T14:00:00-05:00 | 0001-01-01T00:00:00+00:00 | 2020-01-15T15:30:00-05:00 | NATALEE   | LEWIS    | <null>            | <null>             | <null>           |
	And the PassengerOriginDestinationCorrelationId with the highest weight is '3695c75f-752d-ea11-a601-501ac53d3af5'

@snapshotSearch
Scenario: Search for round trip non-stop domestic flight for a single passenger by PNR (TC 39283)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName        | LastName |
		| VOXXWO | <null>       | 2020-02-07 | SUSANMARYJACKSON | MCLEAN   |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the snapshot list has 02 item(s)
	And the weight of item 01 from the snapshot list is 38
	And the weight of item 02 from the snapshot list is 38
	And the PassengerOriginDestination of item 01 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName        | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| d7ec6341-0945-ea11-a601-501ac53d3af5 | VOXXWO | 2020-01-30          | 14               | 0142126914502 | AC                   | 446                   | AC          | 446          | YYZ              | YOW            | 0001-01-01T00:00:00+00:00 | 2020-02-07T10:10:00-05:00 | 0001-01-01T00:00:00+00:00 | 2020-02-07T11:11:00-05:00 | SUSANMARYJACKSON | MCLEAN   | <null>            | <null>             | <null>           |
	And the weighting of item 01 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| true             | true            | false                   | false                  | true                      | true                     | true                          | false                              | true                        | false                            | false               |
	And the PassengerOriginDestination of item 02 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName        | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| ec8ce33d-0945-ea11-a601-501ac53d3af5 | VOXXWO | 2020-01-30          | 14               | 0142126914502 | AC                   | 463                   | AC          | 463          | YOW              | YYZ            | 0001-01-01T00:00:00+00:00 | 2020-02-07T18:00:00-05:00 | 0001-01-01T00:00:00+00:00 | 2020-02-07T19:12:00-05:00 | SUSANMARYJACKSON | MCLEAN   | <null>            | <null>             | <null>           |
	And the weighting of item 02 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| true             | true            | false                   | false                  | true                      | true                     | true                          | false                              | true                        | false                            | false               |
	And the PassengerOriginDestinationCorrelationId with the highest weight is 'e252dcee-0b45-ea11-a601-501ac53d3af5'

@snapshotSearch
Scenario: Search for round trip domestic flights with stop for single passenger by PNR (TC 39290)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| UMV556 | <null>       | 2019-12-17 | SARAH     | MASCH    |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the snapshot list has 02 item(s)
	And the weight of item 01 from the snapshot list is 38
	And the weight of item 02 from the snapshot list is 22
	And the PassengerOriginDestination of item 01 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| e223faf5-9716-ea11-828b-00155d032096 | UMV556 | 2019-11-01          | 14               | 0142121788165 | QK                   | 8308                  | QK          | 8308         | YQQ              | YZP            | 0001-01-01T00:00:00+00:00 | 2019-12-17T10:10:00-08:00 | 0001-01-01T00:00:00+00:00 | 2019-12-17T14:17:00-08:00 | SARAH     | MASCH    | <null>            | <null>             | <null>           |
	And the weighting of item 01 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| true             | true            | false                   | false                  | true                      | true                     | true                          | false                              | true                        | false                            | false               |
	And the PassengerOriginDestination of item 02 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| 551c9b6c-e020-ea11-a601-00155d033220 | UMV556 | 2019-11-01          | 14               | 0142121788165 | QK                   | 8523                  | QK          | 8523         | YZP              | YQQ            | 0001-01-01T00:00:00+00:00 | 2019-12-30T14:35:00-08:00 | 0001-01-01T00:00:00+00:00 | 2019-12-30T22:24:00-08:00 | SARAH     | MASCH    | <null>            | <null>             | <null>           |
	And the weighting of item 02 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| true             | true            | false                   | false                  | true                      | true                     | false                         | false                              | false                       | false                            | false               |
	And the PassengerOriginDestinationCorrelationId with the highest weight is '59f56264-9a16-ea11-828b-00155d032096'

@snapshotSearch
Scenario: Search for round trip domestic flights with stops for multi PAX by Ticket # (TC 39300)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber  | FlightDate | FirstName | LastName  |
		| <null> | 0149462518726 | 2020-01-03 | LACEY     | MACDONALD |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the snapshot list has 04 item(s)
	And the weight of item 01 from the snapshot list is 0
	And the PassengerOriginDestination of item 01 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| d1cb0730-971a-ea11-828b-00155d032096 | QQD4LL | 2019-11-08          | 14               | 0149462518724 | AC                   | 160                   | AC          | 160          | YEG              | YUL            | 0001-01-01T00:00:00+00:00 | 2019-12-22T06:00:00-07:00 | 0001-01-01T00:00:00+00:00 | 2019-12-22T15:15:00-05:00 | KEVIN     | DIONNE   | <null>            | <null>             | <null>           |
	And the weighting of item 01 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| false            | false           | false                   | false                  | false                     | false                    | false                         | false                              | false                       | false                            | false               |
	And the weight of item 02 from the snapshot list is 35
	And the PassengerOriginDestination of item 02 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName  | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| d1cb0730-971a-ea11-828b-00155d032096 | QQD4LL | 2019-11-08          | 14               | 0149462518726 | AC                   | 160                   | AC          | 160          | YEG              | YUL            | 0001-01-01T00:00:00+00:00 | 2019-12-22T06:00:00-07:00 | 0001-01-01T00:00:00+00:00 | 2019-12-22T15:15:00-05:00 | LACEY     | MACDONALD | <null>            | <null>             | <null>           |
	And the weighting of item 02 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| true             | true            | false                   | false                  | true                      | true                     | false                         | false                              | false                       | false                            | true                |
	And the weight of item 03 from the snapshot list is 16
	And the PassengerOriginDestination of item 03 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| 63694836-0424-ea11-a601-00155d033220 | QQD4LL | 2019-11-08          | 14               | 0149462518724 | AC                   | 435                   | AC          | 435          | YUL              | YEG            | 0001-01-01T00:00:00+00:00 | 2020-01-03T16:30:00-05:00 | 0001-01-01T00:00:00+00:00 | 2020-01-03T23:29:00-07:00 | KEVIN     | DIONNE   | <null>            | <null>             | <null>           |
	And the weighting of item 03 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| false            | false           | false                   | false                  | false                     | false                    | true                          | false                              | true                        | false                            | false               |
	And the weight of item 04 from the snapshot list is 51
	And the PassengerOriginDestination of item 04 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName  | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| 63694836-0424-ea11-a601-00155d033220 | QQD4LL | 2019-11-08          | 14               | 0149462518726 | AC                   | 435                   | AC          | 435          | YUL              | YEG            | 0001-01-01T00:00:00+00:00 | 2020-01-03T16:30:00-05:00 | 0001-01-01T00:00:00+00:00 | 2020-01-03T23:29:00-07:00 | LACEY     | MACDONALD | <null>            | <null>             | <null>           |
	And the weighting of item 04 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| true             | true            | false                   | false                  | true                      | true                     | true                          | false                              | true                        | false                            | true                |
	And the PassengerOriginDestinationCorrelationId with the highest weight is 'ba03d1ba-991a-ea11-828b-00155d032096'

@snapshotSearch
Scenario: Search for one way non-stop domestic flight for a single passenger by new Ticket # (TC 39417)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber  | FlightDate | FirstName | LastName |
		| <null> | 0142130175807 | 2020-04-09 | CHRISTINE | CHO      |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the snapshot list has 00 item(s)
  And the status code is '30' with description 'noMatch'

# Changed the destination airport after snapshot
@snapshotSearch
Scenario: Search for one way non-stop international flight for a single passenger by Ticket # (TC 39207)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber  | FlightDate | FirstName | LastName |
		| <null> | 0147448091777 | 2020-04-08 | MOHAMMAD  | ARSHAD   |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the snapshot list has 02 item(s)
	And the weight of item 01 from the snapshot list is 41
	And the weighting of item 01 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| true             | true            | false                   | false                  | true                      | true                     | false                         | true                               | false                       | true                             | true                |
	And the PassengerOriginDestination of item 01 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| 4d67a14e-b06f-ea11-a94c-501ac53d8f46 | QXER9N | 2020-03-12          | 14               | 0147448091777 | AC                   | 728                   | AC          | 728          | YYZ              | LGA            | 0001-01-01T00:00:00+00:00 | 2020-04-07T20:55:00-04:00 | 0001-01-01T00:00:00+00:00 | 2020-04-07T22:27:00-04:00 | MOHAMMAD  | ARSHAD   | <null>            | <null>             | <null>           |
  And the weight of item 02 from the snapshot list is 51
	And the weighting of item 02 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| true             | true            | false                   | false                  | true                      | true                     | true                          | false                              | true                        | false                            | true                |
	And the PassengerOriginDestination of item 02 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| c8b0bd87-5578-ea11-a94c-501ac53d8f46 | QXER9N | 2020-03-12          | 3                | 0147448091777 | ZX                   | 7646                  | ZX          | 7646         | YYZ              | EWR            | 0001-01-01T00:00:00+00:00 | 2020-04-08T09:55:00-04:00 | 0001-01-01T00:00:00+00:00 | 2020-04-08T11:28:00-04:00 | MOHAMMAD  | ARSHAD   | <null>            | <null>             | <null>           |
  And the PassengerOriginDestinationCorrelationId with the highest weight is '901c13a7-b26f-ea11-a94c-501ac53d8f46'

@snapshotSearch
Scenario: Search for one way non-stop international flight with multiple passengers by Ticket # (TC 39349)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber  | FlightDate | FirstName | LastName |
		| <null> | 0143732144306 | 2020-04-04 | SARAH     | BOILY    |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the snapshot list has 02 item(s)
	And the weight of item 01 from the snapshot list is 51
	And the weighting of item 01 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| true             | true            | false                   | false                  | true                      | true                     | true                          | false                              | true                        | false                            | true                |
	And the PassengerOriginDestination of item 01 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| 928bdfcc-3175-ea11-a94c-501ac53d8f46 | KUUNKZ | 2019-11-25          | 3                | 0143732144306 | CM                   | 471                   | CM          | 471          | YYZ              | PTY            | 0001-01-01T00:00:00+00:00 | 2020-04-04T09:45:00-04:00 | 0001-01-01T00:00:00+00:00 | 2020-04-04T14:33:00-05:00 | SARAH     | BOILY    | <null>            | <null>             | <null>           |
	And the weight of item 02 from the snapshot list is 16
	And the weighting of item 02 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| false            | false           | false                   | false                  | false                     | false                    | true                          | false                              | true                        | false                            | false               |
	And the PassengerOriginDestination of item 02 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| 928bdfcc-3175-ea11-a94c-501ac53d8f46 | KUUNKZ | 2019-11-25          | 3                | 0143732144307 | CM                   | 471                   | CM          | 471          | YYZ              | PTY            | 0001-01-01T00:00:00+00:00 | 2020-04-04T09:45:00-04:00 | 0001-01-01T00:00:00+00:00 | 2020-04-04T14:33:00-05:00 | MARIE     | COTE     | <null>            | <null>             | <null>           |
	And the PassengerOriginDestinationCorrelationId with the highest weight is '03cdd3e2-286d-ea11-a94c-501ac53d8f46'

@snapshotSearch
Scenario: Search for Single Pax direct flight with 3 day snapshot by PNR (TC 41348)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| WV6DTV | <null>       | 2020-05-03 | ANA       | GUPTA    |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the snapshot list has 01 item(s)
	And the weight of item 01 from the snapshot list is 38
	And the weighting of item 01 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| true             | true            | false                   | false                  | true                      | true                     | true                          | false                              | true                        | false                            | false               |
	And the PassengerOriginDestination of item 01 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName     | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| cc0b8e2b-4d8e-ea11-86e9-281878f6e6c7 | WV6DTV | 2020-05-02          | 3                | 0142130382401 | AC                   | 125                   | AC          | 125          | YYZ              | YVR            | 0001-01-01T00:00:00+00:00 | 2020-05-03T19:55:00-04:00 | 0001-01-01T00:00:00+00:00 | 2020-05-03T21:56:00-07:00 | ANA           | GUPTA    | <null>            | <null>             | <null>           |

@snapshotSearch
Scenario: Search for Multi pax OD with same family name by Ticket # (TC 41351)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber  | FlightDate | FirstName | LastName |
		| <null> | 7243676539579 | 2020-05-07 | SEBASTIAN | KOVAC    |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the snapshot list has 08 item(s)
	And the weight of item 01 from the snapshot list is 51
	And the weighting of item 01 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| true             | true            | false                   | false                  | true                      | true                     | true                          | false                              | true                        | false                            | true                |
	And the weight of item 02 from the snapshot list is 27
	And the weighting of item 02 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| false            | true            | false                   | false                  | false                     | true                     | true                          | false                              | true                        | false                            | false               |
  And the weight of item 03 from the snapshot list is 27
	And the weighting of item 03 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| false            | true            | false                   | false                  | false                     | true                     | true                          | false                              | true                        | false                            | false               |
  And the weight of item 04 from the snapshot list is 27
	And the weighting of item 04 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| false            | true            | false                   | false                  | false                     | true                     | true                          | false                              | true                        | false                            | false               |
	And the weight of item 05 from the snapshot list is 35
	And the weighting of item 05 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| true             | true            | false                   | false                  | true                      | true                     | false                         | false                              | false                       | false                            | true                |
	And the weight of item 06 from the snapshot list is 11
	And the weighting of item 06 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| false            | true            | false                   | false                  | false                     | true                     | false                         | false                              | false                       | false                            | false               |
	And the weight of item 07 from the snapshot list is 11
	And the weighting of item 07 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| false            | true            | false                   | false                  | false                     | true                     | false                         | false                              | false                       | false                            | false               |
	And the weight of item 08 from the snapshot list is 11
	And the weighting of item 08 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| false            | true            | false                   | false                  | false                     | true                     | false                         | false                              | false                       | false                            | false               |
	And the PassengerOriginDestination of item 01 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName     | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| 29816d73-168f-ea11-86e9-281878f6e6c7 | PIF7WH | 2020-02-01          | 3                | 7243676539579 | LX                   | 4671                  | LX          | 4671         | YYC              | YUL            | 0001-01-01T00:00:00+00:00 | 2020-05-07T06:45:00-06:00 | 0001-01-01T00:00:00+00:00 | 2020-05-07T12:46:00-04:00 | SEBASTIAN     | KOVAC    | <null>            | <null>             | <null>           |
  And the PassengerOriginDestination of item 02 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName     | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| 29816d73-168f-ea11-86e9-281878f6e6c7 | PIF7WH | 2020-02-01          | 3                | 7243676539585 | LX                   | 4671                  | LX          | 4671         | YYC              | YUL            | 0001-01-01T00:00:00+00:00 | 2020-05-07T06:45:00-06:00 | 0001-01-01T00:00:00+00:00 | 2020-05-07T12:46:00-04:00 | GLORIA        | KOVAC    | <null>            | <null>             | <null>           |
	And the PassengerOriginDestination of item 03 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName     | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| 29816d73-168f-ea11-86e9-281878f6e6c7 | PIF7WH | 2020-02-01          | 3                | 7243676539581 | LX                   | 4671                  | LX          | 4671         | YYC              | YUL            | 0001-01-01T00:00:00+00:00 | 2020-05-07T06:45:00-06:00 | 0001-01-01T00:00:00+00:00 | 2020-05-07T12:46:00-04:00 | DANIJEL       | KOVAC    | <null>            | <null>             | <null>           |
	And the PassengerOriginDestination of item 04 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName     | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| 29816d73-168f-ea11-86e9-281878f6e6c7 | PIF7WH | 2020-02-01          | 3                | 7243676539583 | LX                   | 4671                  | LX          | 4671         | YYC              | YUL            | 0001-01-01T00:00:00+00:00 | 2020-05-07T06:45:00-06:00 | 0001-01-01T00:00:00+00:00 | 2020-05-07T12:46:00-04:00 | ILDIKO        | KOVAC    | <null>            | <null>             | <null>           |
	And the PassengerOriginDestination of item 05 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName     | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| ed173a52-3ba8-ea11-96d2-281878f6de3c | PIF7WH | 2020-02-01          | 3                | 7243676539579 | LX                   | 1417                  | LX          | 1417         | BEG              | YYC            | 0001-01-01T00:00:00+00:00 | 2020-06-07T14:40:00+02:00 | 0001-01-01T00:00:00+00:00 | 2020-06-07T19:45:00-06:00 | SEBASTIAN     | KOVAC    | <null>            | <null>             | <null>           |
  And the PassengerOriginDestination of item 06 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName     | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| ed173a52-3ba8-ea11-96d2-281878f6de3c | PIF7WH | 2020-02-01          | 3                | 7243676539585 | LX                   | 1417                  | LX          | 1417         | BEG              | YYC            | 0001-01-01T00:00:00+00:00 | 2020-06-07T14:40:00+02:00 | 0001-01-01T00:00:00+00:00 | 2020-06-07T19:45:00-06:00 | GLORIA        | KOVAC    | <null>            | <null>             | <null>           |
	And the PassengerOriginDestination of item 07 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName     | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| ed173a52-3ba8-ea11-96d2-281878f6de3c | PIF7WH | 2020-02-01          | 3                | 7243676539581 | LX                   | 1417                  | LX          | 1417         | BEG              | YYC            | 0001-01-01T00:00:00+00:00 | 2020-06-07T14:40:00+02:00 | 0001-01-01T00:00:00+00:00 | 2020-06-07T19:45:00-06:00 | DANIJEL       | KOVAC    | <null>            | <null>             | <null>           |
	And the PassengerOriginDestination of item 08 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName     | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| ed173a52-3ba8-ea11-96d2-281878f6de3c | PIF7WH | 2020-02-01          | 3                | 7243676539583 | LX                   | 1417                  | LX          | 1417         | BEG              | YYC            | 0001-01-01T00:00:00+00:00 | 2020-06-07T14:40:00+02:00 | 0001-01-01T00:00:00+00:00 | 2020-06-07T19:45:00-06:00 | ILDIKO        | KOVAC    | <null>            | <null>             | <null>           |

@snapshotSearch
Scenario: Search - Single flight with multi pax of different last names by PNR (TC 39297)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| PS549X | <null>       | 2020-05-07 | TU        | TIEU     |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the snapshot list has 04 item(s)
	And the weight of item 01 from the snapshot list is 16
	And the weighting of item 01 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| false            | false           | false                   | false                  | false                     | false                    | true                          | false                              | true                        | false                            | false               |
	And the weight of item 02 from the snapshot list is 16
	And the weighting of item 02 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| false            | false           | false                   | false                  | false                     | false                    | true                          | false                              | true                        | false                            | false               |
	And the weight of item 03 from the snapshot list is 16
	And the weighting of item 03 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| false            | false           | false                   | false                  | false                     | false                    | true                          | false                              | true                        | false                            | false               |
	And the weight of item 04 from the snapshot list is 38
	And the weighting of item 04 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| true             | true            | false                   | false                  | true                      | true                     | true                          | false                              | true                        | false                            | false               |
	And the PassengerOriginDestination of item 01 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| c90a7c92-7186-ea11-86e9-281878f6e6c7 | PS549X | 2020-01-11          | 14               | <null>        | OZ                   | 735                   | OZ          | 735          | ICN              | SGN            | 0001-01-01T00:00:00+00:00 | 2020-05-07T19:10:00+09:00 | 0001-01-01T00:00:00+00:00 | 2020-05-07T22:40:00+07:00 | LINH      | TRAN     | <null>            | <null>             | <null>           |
	And the PassengerOriginDestination of item 02 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| c90a7c92-7186-ea11-86e9-281878f6e6c7 | PS549X | 2020-01-11          | 14               | <null>        | OZ                   | 735                   | OZ          | 735          | ICN              | SGN            | 0001-01-01T00:00:00+00:00 | 2020-05-07T19:10:00+09:00 | 0001-01-01T00:00:00+00:00 | 2020-05-07T22:40:00+07:00 | THONGVI   | TRAN     | <null>            | <null>             | <null>           |
	And the PassengerOriginDestination of item 03 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| c90a7c92-7186-ea11-86e9-281878f6e6c7 | PS549X | 2020-01-11          | 14               | <null>        | OZ                   | 735                   | OZ          | 735          | ICN              | SGN            | 0001-01-01T00:00:00+00:00 | 2020-05-07T19:10:00+09:00 | 0001-01-01T00:00:00+00:00 | 2020-05-07T22:40:00+07:00 | THIEUHONG | NGU      | <null>            | <null>             | <null>           |
	And the PassengerOriginDestination of item 04 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| c90a7c92-7186-ea11-86e9-281878f6e6c7 | PS549X | 2020-01-11          | 14               | <null>        | OZ                   | 735                   | OZ          | 735          | ICN              | SGN            | 0001-01-01T00:00:00+00:00 | 2020-05-07T19:10:00+09:00 | 0001-01-01T00:00:00+00:00 | 2020-05-07T22:40:00+07:00 | TU        | TIEU     | <null>            | <null>             | <null>           |

@snapshotSearch
Scenario: Search - Single pax with multi leg itinerary (3 flights) on different date (TC 39299)
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And a passenger fills the Self Serve Eligibility form
		| PNR    | TicketNumber | FlightDate | FirstName | LastName |
		| QMKYAI | <null>       | 2019-12-16 | ALEXANDER | KUZMIN   |
	When the passenger submits the form
	Then the HTTP Status Code is Ok
	And the snapshot list has 01 item(s)
	And the weight of item 01 from the snapshot list is 33
	And the weighting of item 01 from the snapshot list is
		| isFirstNameMatch | isLastNameMatch | isInverseFirstNameMatch | isInverseLastNameMatch | isFirstNameSubstringMatch | isLastNameSubstringMatch | isDepartureLocalDateTimeMatch | isDepartureLocalDateTimeFuzzyMatch | isArrivalLocalDateTimeMatch | isArrivalLocalDateTimeFuzzyMatch | isTicketNumberMatch |
		| true             | true            | false                   | false                  | true                      | true                     | false                         | true                               | true                        | false                            | false               |
	And the PassengerOriginDestination of item 01 from the snapshot list is
		| OriginDestinationCorrelationId       | PNR    | PNRCreationDateTime | ProtectionPeriod | TicketNumber  | MarketingAirlineCode | MarketingFlightNumber | AirlineCode | FlightNumber | DepartureAirport | arrivalAirport | DepartureDateTime         | DepartureLocalDateTime    | ArrivalDateTime           | ArrivalLocalDateTime      | FirstName | LastName | DocumentFirstName | DocumentMiddleName | DocumentLastName |
		| 33302ec1-3115-ea11-828b-00155d032096 | QMKYAI | 2019-10-16          | 14               | 2205086107193 | LH                   | 6552                  | AC          | 214          | YVR              | DME            | 0001-01-01T00:00:00+00:00 | 2019-12-15T14:00:00-08:00 | 0001-01-01T00:00:00+00:00 | 2019-12-16T17:55:00+03:00 | ALEXANDER | KUZMIN   | <null>            | <null>             | <null>           |
