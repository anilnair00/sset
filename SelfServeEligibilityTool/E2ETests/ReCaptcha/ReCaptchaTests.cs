using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Net.Http;
using System.Configuration;
using System.Text;

namespace ODE.SSET.E2ETests
{
  public partial class ReCaptchaTests
  {
    private static string Token = string.Empty;
    private static ResponseToken response = new ResponseToken();

    public class ResponseToken
    {
      public DateTime challenge_ts { get; set; }
      public float score { get; set; }
      public List<string> ErrorCodes { get; set; }
      public bool Success { get; set; }
      public string hostname { get; set; }
    }
  }
}
