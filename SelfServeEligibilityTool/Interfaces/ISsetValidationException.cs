namespace ODE.SSET.Interfaces
{
  public interface ISsetValidationException : IValidationException
  {
    public string ValidationMessage { get; set; }
  }
}
