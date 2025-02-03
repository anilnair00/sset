using Microsoft.Extensions.Caching.Memory;

namespace ODE.SSET.Core.Framework.IdentityProvider.Cache
{
  /// <remarks>Should be a distributed cache, local for now.</remarks>
  public class IdentityProviderCache : MemoryCache, IIdentityProviderCache
  {
    public IdentityProviderCache()
      : base(new MemoryCacheOptions())
    {
    }
  }
}
