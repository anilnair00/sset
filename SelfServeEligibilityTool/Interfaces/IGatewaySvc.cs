using System;
using System.Collections.Generic;
using System.Text;

namespace ODE.SSET.Interfaces
{
  public interface IGatewaySvc
  {
    public IPassengerProtectionResponse SnapshotSearch(IEligibilityRequest eligibilityRequest);
  }
}
