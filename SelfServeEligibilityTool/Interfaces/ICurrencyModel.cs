using System;

namespace ODE.SSET.Interfaces
{
  public interface ICurrencyModel
  {
    public int Id { get; set; }

    public string Code { get; set; }

    public string Symbol { get; set; }

    public string Description { get; set; }

    public Guid DynamicsId { get; set; }

    public int SortOrder { get; set; }

    public string LanguageCode { get; set; }
  }
}