using ODE.SSET.Interfaces;
using System.Collections.Generic;

namespace ODE.SSET.Core.Domain
{
  public class ExpenseFormLookupData : IExpenseFormLookupData
  {
    public IEnumerable<IExpenseTypeModel> ExpenseTypes { get; set; }
    public IEnumerable<IMealTypeModel> MealTypes { get; set; }
    public IEnumerable<ICurrencyModel> Currencies { get; set; }
    public IEnumerable<ITransportationTypeModel> TransportationTypes { get; set; }
  }
}
