using System;
using System.Collections.Generic;
using System.Text;

namespace ODE.SSET.Interfaces.Dynamics
{
  public interface ISsetOriginDestinationRequest : ISsetOriginDestination
  {
    public Guid? AssessmentId { get; set; }
  }
}
