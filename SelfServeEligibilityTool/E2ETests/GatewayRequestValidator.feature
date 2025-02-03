Feature: GatewayRequestValidator
	In order to ensure that my request message is valid
	As the website
	I need the API to identify all my mistakes

@RequestValidation
Scenario Outline: The website submits an invalid request message
	Given the ODE:SSET keys are available from the Azure App Configuration Store
  And the message request payload contains
		| PNR   | TicketNumber   | FlightDate   | FirstName   | LastName   |
		| <PNR> | <TicketNumber> | <FlightDate> | <FirstName> | <LastName> |
	When I send a message to the gateway endpoint
	Then the response message highlights my mistakes
	And the response message contains the expected <BusinessRuleCodeList>

	Examples:
		| TestCaseExampleTitle             | PNR     | TicketNumber   | FlightDate | FirstName                                            | LastName                                             | BusinessRuleCodeList                                          |
		| PNRTooLong                       | 1234567 | <null>         | 2020-01-01 | John                                                 | Crichton                                             | 1010005                                                       |
		| PNRTooShort                      | 12345   | <null>         | 2020-01-01 | Aeryn                                                | Sun                                                  | 1010010                                                       |
		| TicketNumberTooLong              | <null>  | 12345678901234 | 2020-01-01 | John                                                 | Crichton                                             | 1020005                                                       |
		| TicketNumberTooShort             | <null>  | 123456789012   | 2020-01-01 | John                                                 | Crichton                                             | 1020010                                                       |
		| AllFieldsLeftEmpty               |         |                |            |                                                      |                                                      | 1010010, 1020010, 1030010, 1030015, 1040010, 1050010, 1090010 |
		| FieldsWithSpecialCharacters      | 12345&  | 123456789012!  | 2020-01-01 | @eryn                                                | $un                                                  | 1010015, 1020015, 1040015, 1050015, 1090010                   |
		| FlightDateOlderThanAPPR          | <null>  | 1234567890123  | 2019-12-14 | John                                                 | Crichton                                             | 1030010                                                       |
		| FlightDateOlderThan366Days       | 123456  | <null>         | 2019-01-01 | John                                                 | Crichton                                             | 1030010, 1030015                                              |
		| InvalidFlightDateFormat          | <null>  | 1234567890123  | ABCD-01-01 | John                                                 | Crichton                                             | 1030010, 1030015                                              |
		| FlightDateGreaterThanCurrentDate | 123456  | <null>         | 2022-01-01 | John                                                 | Crichton                                             | 1030005                                                       |
		| FirstNameTooLong                 | 123456  | <null>         | 2020-01-01 | Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz | Alphabet                                             | 1040005                                                       |
		| FirstNameTooShort                | <null>  | 1234567890123  | 2020-01-01 |                                                      | Alphabet                                             | 1040010                                                       |
		| LastNameTooLong                  | <null>  | 1234567890123  | 2020-01-01 | Alphabet                                             | Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz | 1050005                                                       |
		| LastNameTooShort                 | 123456  | <null>         | 2020-01-01 | Alphabet                                             |                                                      | 1050010                                                       |
		| PNRAndTicketNumberAreNull        | <null>  | <null>         | 2020-01-01 | John                                                 | Crichton                                             | 1090005                                                       |
		| PNRAndTicketNumberAreNotNull     | 123456  | 1234567890123  | 2020-01-01 | John                                                 | Crichton                                             | 1090010                                                       |
