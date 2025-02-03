namespace ODE.SSET.Interfaces
{
  using System;

  public interface IAirportModel
  {
    public string LanguageCode { get; set; }
    public string AirportCode { get; set; }
    public string CountryCode { get; set; }
    public string ProvinceCode { get; set; }
    public string AirportName { get; set; }
    public string CityName { get; set; }
    public string CountryName { get; set; }
    public string ProvinceName { get; set; }
    public string ShortName { get; set; }
    public string TimeZone { get; set; }
    public string Latitude { get; set; }
    public string Longitude { get; set; }
    public DateTimeOffset? RetrievedAt { get; set; }
    public DateTimeOffset? ExpireAt { get; set; }
    public string ServiceEnvironment { get; set; }
    public string UniqueIdentifier { get; set; }
    public Guid DynamicsId { get; set; }
  }
}
