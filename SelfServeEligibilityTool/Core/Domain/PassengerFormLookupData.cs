namespace ODE.SSET.Core.Domain
{
  using ODE.SSET.Interfaces;
  using System.Collections.Generic;

  public class PassengerFormLookupData : IPassengerFormLookupData
  {
    public IEnumerable<ITitleModel> Titles { get; set; }
    public IEnumerable<ICountryModel> Countries { get; set; }
    public IEnumerable<IStarAllianceTierModel> StarAllianceTiers { get; set; }
    public IEnumerable<IRelationshipModel> Relationships { get; set; }
  }
}
