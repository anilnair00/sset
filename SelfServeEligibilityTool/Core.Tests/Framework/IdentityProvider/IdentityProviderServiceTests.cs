using System;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Extensions.Options;
using ODE.SSET.Core.Framework.IdentityProvider;
using ODE.SSET.Core.Framework.IdentityProvider.Cache;
using Xunit;

namespace ODE.SSET.Core.Tests.Framework.IdentityProvider
{
  public class IdentityProviderServiceTests : IDisposable
  {
    private readonly HttpClient httpClient;
    private readonly IIdentityProviderCache cache;
    private readonly IOptions<IdentityProviderOptions> options;
    private readonly IIdentityProviderService identityProviderService;

    public IdentityProviderServiceTests()
    {
      httpClient = new HttpClient()
      {
        BaseAddress = new Uri("https://fs-int.aircanada.ca")
      };

      cache = new IdentityProviderCache();

      options = Options.Create(new IdentityProviderOptions()
      {
        ClientId = "AirCanada.Services.SSET",
        ClientSecret = "Amseqhpl6Q0ZCcVYpKJq5VXxQZGT3iPPXuKboyzfynrtHTgaYXX6DstQLtUiB9Rk"
      });

      identityProviderService = new IdentityProviderService(httpClient, cache, options);
    }

    public void Dispose()
    {
      httpClient.Dispose();

      cache.Dispose();
    }

    [Fact]
    public async Task SSETAppCanAuthenticate()
    {
      var token = await identityProviderService.LoginAsync();

      token.Should().NotBeNullOrEmpty();
    }
  }
}
