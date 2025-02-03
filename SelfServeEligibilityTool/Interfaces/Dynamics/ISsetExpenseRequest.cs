namespace ODE.SSET.Interfaces.Dynamics
{
  using System;
  using System.Collections.Generic;

  public interface ISsetExpenseRequest
  {
    public long ExpenseTypeDynamicsId { get; set; }

    public string CurrencyCode { get; set; }

    public decimal Amount { get; set; }

    public long? TransportationTypeDynamicsId { get; set; }

    public DateTime? TransactionDate { get; set; }

    public long? MealTypeDynamicsId { get; set; }

    public string DisruptionCityAirportCode { get; set; }

    public DateTime? CheckInDate { get; set; }

    public DateTime? CheckOutDate { get; set; }

    public IEnumerable<ISsetExpenseReceiptRequest> Receipts { get; set; }
  }
}
