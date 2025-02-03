using System.Threading.Tasks;

namespace ODE.SSET.Core.Framework.IdentityProvider
{
  public interface IIdentityProviderService
  {
    Task<string> LoginAsync();
  }
}
