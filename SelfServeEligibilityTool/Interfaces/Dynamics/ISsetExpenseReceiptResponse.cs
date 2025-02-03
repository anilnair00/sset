namespace ODE.SSET.Interfaces.Dynamics
{
  using System;

  public interface ISsetExpenseReceiptResponse
  {
    public Guid? DynamicsAnnotationWebRequestId { get; set; }

    public string FileName { get; set; }

    public string MimeType { get; set; }

    public string Subject { get; set; }

    public bool IsSuccessful { get; set; }
  }
}
