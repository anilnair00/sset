namespace ODE.SSET.Core.Domain
{
  using ODE.SSET.Interfaces;

  public class ValidationException : IValidationException
  {
    public string PropertyName { get; set; }
    public int BusinessRuleCode { get; set; }
  }
}
