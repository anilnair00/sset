using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using ODE.SSET.Core.Framework.IdentityProvider;

namespace ODE.SSET.Core.Framework.HTTP
{
  public class AuthenticationHandler : DelegatingHandler
  {
    private readonly IIdentityProviderService _identityProviderService;

    public AuthenticationHandler(IIdentityProviderService identityProviderService)
    {
      _identityProviderService = identityProviderService;
    }

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
      var token = await _identityProviderService.LoginAsync();

      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

      return await base.SendAsync(request, cancellationToken);
    }
  }
}
