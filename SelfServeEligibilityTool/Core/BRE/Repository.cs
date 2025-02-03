using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using NRules;
using NRules.Fluent;
using ODE.SSET.Core.Domain;

namespace ODE.SSET.Core.BRE
{
  public class Repository
  {
    private RuleRepository validationRuleRepository;
    private RuleRepository weightingRuleRepository;
    private RuleRepository validationSelfRuleRepository;

    public Repository()
    {
      //Load rules
      validationRuleRepository = new RuleRepository();
      validationRuleRepository.Load(x => x
          .From(Assembly.GetExecutingAssembly())
          .Where(rule => rule.IsTagged("Validation"))
          .To("ValidationRuleSet"));

      weightingRuleRepository = new RuleRepository();
      weightingRuleRepository.Load(x => x
          .From(Assembly.GetExecutingAssembly())
          .Where(rule => rule.IsTagged("Weighting"))
          .To("WeightingRuleSet"));

      validationSelfRuleRepository = new RuleRepository();
      validationSelfRuleRepository.Load(x => x
          .From(Assembly.GetExecutingAssembly())
          .Where(rule => rule.IsTagged("ValidationSelfAssessment"))
          .To("ValidationRuleSelfSet"));
    }

    public RuleRepository ValidationRuleRepository
    {
      get => validationRuleRepository; 
    }

    public RuleRepository WeightingRuleRepository
    {
      get => weightingRuleRepository;
    }

    public RuleRepository ValidationSelfRuleRepository
    {
      get => validationSelfRuleRepository;
    }
  }
}
