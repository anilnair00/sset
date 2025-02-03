namespace ODE.SSET.Interfaces
{
  using System.Collections.Generic;

  public interface IPassengerFormLookupData
  {
    public IEnumerable<ITitleModel> Titles { get; set; }
    public IEnumerable<ICountryModel> Countries { get; set; }
    public IEnumerable<IStarAllianceTierModel> StarAllianceTiers { get; set; }
    public IEnumerable<IRelationshipModel> Relationships { get; set; }
  }
}
