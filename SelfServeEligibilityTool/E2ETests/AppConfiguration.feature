Feature: AppConfiguration
  Azure App Configuration provides a service to centrally manage application settings and feature flags

@AppConfiguration
Scenario: Retrieve CIP root URL from the App Configuration store
  Given the ODE:SSET keys are available from the Azure App Configuration Store
	And The key 'ODE:CIP:Settings:Server:URL'
	When The configuration item is retrieved from the App Configuration store 
	Then The key-value is 'acode-pcat-sit.azurewebsites.net'
