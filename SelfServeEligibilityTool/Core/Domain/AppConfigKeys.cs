using System;
using System.Collections.Generic;
using System.Text;

namespace ODE.SSET.Core.Domain
{
  public static class AppConfigKeys
  {
    public static string CIP_Server_URL { get => "ODE:CIP:Settings:Server:URL"; }
    public static string SSET_Gateway_URI { get => "ODE:SSET:Settings:Server:BaseAddressUri"; }
    public static string SSET_Gateway_URL { get => "ODE:SSET:Settings:Gateway:URL"; }
    public static string SSET_Gateway_Host { get => "ODE:SSET:Settings:Gateway:Host"; }
    public static string SSET_Gateway_Port { get => "ODE:SSET:Settings:Gateway:Port"; }
  }
}
