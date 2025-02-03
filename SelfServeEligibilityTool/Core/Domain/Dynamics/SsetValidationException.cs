namespace ODE.SSET.Core.Domain.Dynamics
{
  using ODE.SSET.Interfaces;

  internal class SsetValidationException : ISsetValidationException
  {
    public string PropertyName { get; set; }
    public int BusinessRuleCode { get; set; }
    public string ValidationMessage { get; set; }
  }
}
