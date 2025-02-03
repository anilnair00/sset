using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using ODE.SSET.Core.Domain;
using ODE.SSET.Core.Domain.SelfAssessment;

namespace ODE.SSET.Core.CIP
{
  public interface IFlightDisruptionService
  {
    Task<(EligibilityResponse, Guid?)> RunFlightDisruptionClaimAsync(Collection<AssessmentRequest> assessmentRequests, ItineraryBaseModel itineraryBaseModel, bool dynamicApiCall);
  }
}
