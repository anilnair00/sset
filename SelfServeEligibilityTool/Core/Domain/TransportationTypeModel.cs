using ODE.SSET.Interfaces;

namespace ODE.SSET.Core.Domain
{
  public class TransportationTypeModel : ITransportationTypeModel
  {
    public int Id { get; set; }

    public string Description { get; set; }

    public long DynamicsId { get; set; }

    public string LanguageCode { get; set; }
  }
}
