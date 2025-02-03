﻿namespace ODE.SSET.Interfaces.Dynamics
{
  using System.Collections.Generic;

  public interface ISsetRequest
  {
    public string SessionId { get; set; }

    public string RecaptchaResponseToken { get; set; }

    public IEnumerable<ISsetPassengerRequest> Passengers { get; set; }

    public IEnumerable<ISsetOriginDestinationRequest> OriginDestinations { get; set; }

    public long PortalLanguageDynamicsId { get; set; }

    public bool IsManualFlow { get; set; }
  }
}
