using System.Collections.Generic;

namespace ODE.SSET.Interfaces
{
  public interface IExpenseFormLookupData
  {
    public IEnumerable<IExpenseTypeModel> ExpenseTypes { get; set; }
    public IEnumerable<IMealTypeModel> MealTypes { get; set; }
    public IEnumerable<ICurrencyModel> Currencies { get; set; }
    public IEnumerable<ITransportationTypeModel> TransportationTypes { get; set; }
  }
}
