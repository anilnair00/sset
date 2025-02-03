using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;
using TechTalk.SpecFlow.Assist.ValueRetrievers;
using ODE.SSET.Core.Domain;
using ODE.SSET.Interfaces.Enums;
using FluentAssertions;
using System.Collections.Specialized;

namespace ODE.SSET.E2ETests
{
  [Binding, Scope(Feature = "Eligibility")]
  public class EligibilitySteps
  {
    private readonly EligibilityResponse eligibilityResponse;

    public EligibilitySteps(EligibilityResponse eligibilityResponse)
    {
      this.eligibilityResponse = eligibilityResponse;
    }

    [BeforeTestRun]
    public static void BeforeTestRun()
    {
      Service.Instance.ValueRetrievers.Register(new NullValueRetriever("<null>"));
    }

    [Then(@"the EligibilityResponse is")]
    public void ThenTheEligibilityResponseIs(Table expectedResponse)
    {
      EligibilityResponse expectedEligibilityResponse = expectedResponse.CreateInstance<EligibilityResponse>();
      eligibilityResponse.StatusCode.Should().Be(expectedEligibilityResponse.StatusCode);
      eligibilityResponse.StatusDescription.Should().Be(expectedEligibilityResponse.StatusDescription);
      eligibilityResponse.DisruptionCode.Should().Be(expectedEligibilityResponse.DisruptionCode);
      eligibilityResponse.MostSignificantLegId.Should().Be(expectedEligibilityResponse.MostSignificantLegId);
      eligibilityResponse.ArrivalDelayIATACode.Should().Be(expectedEligibilityResponse.ArrivalDelayIATACode);
      eligibilityResponse.SecondaryCancellationReasonCode.Should().Be(expectedEligibilityResponse.SecondaryCancellationReasonCode);
    }
  }
}
