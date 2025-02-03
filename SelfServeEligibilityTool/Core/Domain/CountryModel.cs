namespace ODE.SSET.Core.Domain
{
  using ODE.SSET.Interfaces;

  public class CountryModel: ICountryModel
  {
    public int Id { get; set; }
    public string LanguageCode { get; set; }
    public string Code { get; set; }
    public string Description { get; set; }
    public long DynamicsId { get; set; }
    public int SortOrder { get; set; }
  }
}
