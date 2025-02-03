using System;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;
using TechTalk.SpecFlow.Assist.ValueRetrievers;


namespace ODE.SSET.E2ETests
{
    [Binding]
    public class RuntimeEnvironmentSteps
    {
    [BeforeTestRun]
    public static void BeforeTestRun()
    {
      Service.Instance.ValueRetrievers.Register(new NullValueRetriever("<null>"));
    }
  }
}
