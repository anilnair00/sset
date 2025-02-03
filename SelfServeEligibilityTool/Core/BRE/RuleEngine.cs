using System;
using System.Collections.Generic;
using System.Text;
using NRules;
using NRules.Fluent;

namespace ODE.SSET.Core.BRE
{
  public class RuleEngine
  {
    private readonly Factory factory;
    private readonly ISession validationSession;
    private readonly ISession weightingSession;
    private readonly ISession validationSelfAssessmentSession;

    public RuleEngine(Factory injectedFactory)
    {
      factory = injectedFactory;
      validationSession = factory.ValidationSessionFactory.CreateSession();
      weightingSession = factory.WeightingSessionFactory.CreateSession();
      validationSelfAssessmentSession = factory.ValidationSelfAssessmentFactory.CreateSession();
    }

    public ISession ValidationSession
    {
      get => validationSession;
    }

    public ISession WeightingSession
    {
      get => weightingSession;
    }

    public ISession ValidationSelfAssessmentSession
    {
      get => validationSelfAssessmentSession;
    }
  }
}
