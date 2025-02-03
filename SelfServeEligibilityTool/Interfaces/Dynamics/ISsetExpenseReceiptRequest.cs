namespace ODE.SSET.Interfaces.Dynamics
{
  public interface ISsetExpenseReceiptRequest
  {
    public string FileName { get; set; }

    public byte[] DocumentBody { get; set; }

    public string MimeType { get; set; }
  }
}
