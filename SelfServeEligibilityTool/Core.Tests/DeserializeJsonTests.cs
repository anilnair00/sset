using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;
using FluentAssertions;
using Xunit;
using ODE.SSET.Core.Domain;
using ODE.SSET.Interfaces;
using ODE.SSET.Interfaces.Enums;

namespace ODE.SSET.Core.Tests
{
  public class DeserializeJsonTests
  {
    //private readonly string jsonResponse = "{\"gatewayRequest\":{\"GatewayRequestContext\":{\"RuntimeEnvironment\":0,\"ValidationExceptions\":[{\"PropertyName\":\"PNR\",\"BusinessRuleCode\":1010005}]},\"EligibilityRequest\":{\"PNR\":\"1234567\",\"FlightDate\":\"2020-03-26T00:00:00+00:00\",\"FirstName\":\"FirstName\",\"LastName\":\"LastName\",\"TicketNumber\":\"1234567890123\"}},\"ExceptionMessage\":null,\"EligibilityResponse\":{\"Status\":0,\"ErrorMsg\":null,\"DisruptionCode\":0,\"ReasonCode\":0}}";
    private readonly string jsonResponse = "{\"gatewayRequest\":{\"gatewayRequestContext\":{\"runtimeEnvironment\":0,\"validationExceptions\":[{\"propertyName\":\"PNR\",\"businessRuleCode\":1010005}]},\"eligibilityRequest\":{\"PNR\":\"1234567\",\"flightDate\":\"2020-03-26T00:00:00+00:00\",\"firstName\":\"FirstName\",\"lastName\":\"LastName\",\"ticketNumber\":\"1234567890123\"}},\"exceptionMessage\":null,\"eligibilityResponse\":{\"status\":0,\"errorMsg\":null,\"disruptionCode\":0,\"reasonCode\":0}}";

    [Fact]
    public void CanDeserializeTest()
    {
      var options = new JsonSerializerOptions();
      options.PropertyNameCaseInsensitive = true;
      GatewayResponse gatewayResponse = JsonSerializer.Deserialize<GatewayResponse>(jsonResponse, options);
      gatewayResponse.GatewayRequest.GatewayRequestContext.ValidationExceptions.Count.Should().Be(1);
    }
  }
}

