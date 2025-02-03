namespace ODE.SSET.Interfaces.Dynamics
{
  using System;
  using System.Collections.Generic;

  public interface ISsetExpenseResponse
  {
    public long ExpenseTypeDynamicsId { get; set; }

    public string CurrencyCode { get; set; }

    public decimal Amount { get; set; }

    public Guid? DynamcisExpenseWebRequestId { get; set; }

    public bool IsSuccessful { get; set; }

    public IEnumerable<ISsetExpenseReceiptResponse> ReceiptResponses { get; set; }
  }
}
