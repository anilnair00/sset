namespace ODE.SSET.Core.Domain.Dynamics
{
  using ODE.SSET.Interfaces.Dynamics;
  using System;

  public class SsetWebRequestResponse : ISsetWebRequestResponse
  {
    public Guid? DynamicsWebRequestId { get; set; }

    public bool IsSuccessful { get; set; }
  }
}
