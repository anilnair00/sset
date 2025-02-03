Feature: RuntimeEnvironment
	In order to avoid crossing environments by mistake
	As a client of the SSET Gateway API
	I need my request to be handled by the specified environment

@RequestContextValidation
Scenario Outline: Set the target environment to Production when running on test environment
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And the message request payload contains
		| PNR   | TicketNumber   | FlightDate   | FirstName   | LastName   |
		| <PNR> | <TicketNumber> | <FlightDate> | <FirstName> | <LastName> |
	And the request Runtime Environment is set to 'PRD'
	When I send a message to the gateway endpoint
	Then the response message highlights my mistakes
	And the response message contains the expected <BusinessRuleCodeList>

	Examples:
		| TestCaseExampleTitle | PNR    | TicketNumber | FlightDate | FirstName | LastName | BusinessRuleCodeList |
		| TargetProduction     | 123456 | <null>       | 2020-01-01 | John      | Crichton | 1000005, 1000025     |

@RequestContextValidation
Scenario Outline: Bypass reCaptcha in production
	Given the ODE:SSET keys are available from the Azure App Configuration Store
	And the message request payload contains
		| PNR   | TicketNumber   | FlightDate   | FirstName   | LastName   |
		| <PNR> | <TicketNumber> | <FlightDate> | <FirstName> | <LastName> |
	And the request Runtime Environment is set to 'PRD'
	When I send a message to the gateway endpoint
	Then the response message highlights my mistakes
	And the response message contains the expected <BusinessRuleCodeList>

	Examples:
		| TestCaseExampleTitle | PNR    | TicketNumber | FlightDate | FirstName | LastName | BusinessRuleCodeList |
		| TargetProduction     | 123456 | <null>       | 2020-01-01 | John      | Crichton | 1000005,1000025      |

#@RequestContextValidation
#Scenario Outline: Missing reCaptcha token
#	Given the ODE:SSET keys are available from the Azure App Configuration Store
#	And the message request payload contains
#		| PNR   | TicketNumber   | FlightDate   | FirstName   | LastName   |
#		| <PNR> | <TicketNumber> | <FlightDate> | <FirstName> | <LastName> |
#	And Test With Recaptcha is enable
#	When I send a message to the gateway endpoint
#	Then the response message highlights my mistakes
#	And the response message contains the expected <BusinessRuleCodeList>
#
#	Examples:
#		| TestCaseExampleTitle | PNR    | TicketNumber | FlightDate | FirstName | LastName | BusinessRuleCodeList |
#		| TargetProduction     | 123456 | <null>       | 2020-01-01 | John      | Crichton | 1000020              |