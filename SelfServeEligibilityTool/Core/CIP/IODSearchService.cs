using System.Collections.Generic;
using System.Threading.Tasks;
using ODE.SSET.Core.Domain;
using ODE.SSET.Core.Domain.SelfAssessment;

namespace ODE.SSET.Core.CIP
{
  public interface IODSearchService
  {
    Task<IEnumerable<PassengerOriginDestination>> SearchAsync(string pnr = null, string ticketNumber = null);
    Task<ItineraryBaseModel> OriginDestinationSearchAsync(string ticketNumber = null, string lastName = null);
  }
}
