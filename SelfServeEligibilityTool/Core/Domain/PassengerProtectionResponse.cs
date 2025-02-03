using System;
using System.Collections.Generic;
using System.Text;
using ODE.SSET.Interfaces;

namespace ODE.SSET.Core.Domain
{
  public class PassengerProtectionResponse : IPassengerProtectionResponse
  {
    public List<PassengerOriginDestinationWeighting> PassengerOriginDestinationWeightings { get; set; }
  }
}
