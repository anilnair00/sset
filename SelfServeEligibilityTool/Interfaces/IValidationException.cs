using System;
using System.Collections.Generic;
using System.Text;

namespace ODE.SSET.Interfaces
{
  public interface IValidationException
  {
    public string PropertyName { get; set; }
    public int BusinessRuleCode { get; set; }
  }
}
