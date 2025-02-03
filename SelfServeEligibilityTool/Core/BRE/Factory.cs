using System;
using System.Collections.Generic;
using System.Text;
using NRules;
using NRules.Fluent;
using ODE.SSET.Core.BRE;

namespace ODE.SSET.Core.BRE
{
  public class Factory
  {
    private readonly Repository repository;
    private readonly ISessionFactory validationSessionFactory;
    private readonly ISessionFactory weightingSessionFactory;
    private readonly ISessionFactory validationSelfAssessmentFactory;

    public Factory(Repository injectedRepository)
    {
      repository = injectedRepository;
      validationSessionFactory = repository.ValidationRuleRepository.Compile();
      weightingSessionFactory = repository.WeightingRuleRepository.Compile();
      validationSelfAssessmentFactory = repository.ValidationSelfRuleRepository.Compile();
    }

    public ISessionFactory ValidationSessionFactory
    {
      get => validationSessionFactory;
    }

    public ISessionFactory WeightingSessionFactory
    {
      get => weightingSessionFactory;
    }
    public ISessionFactory ValidationSelfAssessmentFactory
    {
      get => validationSelfAssessmentFactory;
    }

  }
}
