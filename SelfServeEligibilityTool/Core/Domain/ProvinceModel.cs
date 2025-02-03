namespace ODE.SSET.Core.Domain
{
  using ODE.SSET.Interfaces;

  public class ProvinceModel : IProvinceModel
  {
    public int Id { get; set; }

    public string Code { get; set; }

    public string Description { get; set; }

    public string CountryCode { get; set; }

    public string LanguageCode { get; set; }
  }
}
