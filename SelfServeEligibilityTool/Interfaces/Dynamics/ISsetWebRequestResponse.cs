namespace ODE.SSET.Interfaces.Dynamics
{
  using System;

  public interface ISsetWebRequestResponse
  {
    public Guid? DynamicsWebRequestId { get; set; }

    public bool IsSuccessful { get; set; }
  }
}
