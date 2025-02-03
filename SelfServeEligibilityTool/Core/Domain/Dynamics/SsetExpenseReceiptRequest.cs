namespace ODE.SSET.Core.Domain.Dynamics
{
  using ODE.SSET.Interfaces.Dynamics;

  public class SsetExpenseReceiptRequest : ISsetExpenseReceiptRequest
  {
    public string FileName { get; set; }

    public byte[] DocumentBody { get; set; }

    public string MimeType { get; set; }
  }
}
