namespace ODE.SSET.Core.Domain
{
  using ODE.SSET.Interfaces;

  public class StarAllianceTierModel : IStarAllianceTierModel
  {
    public int Id { get; set; }

    public string Description { get; set; }

    public long DynamicsId { get; set; }

    public string LanguageCode { get; set; }
  }
}
