using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using ODE.SSET.Core.Framework.IdentityProvider.Cache;

namespace ODE.SSET.Core.Framework.IdentityProvider
{
  public class IdentityProviderService : IIdentityProviderService
  {
    private readonly HttpClient _httpClient;
    private readonly IIdentityProviderCache _cache;
    private readonly IdentityProviderOptions _options;

    public IdentityProviderService(HttpClient httpClient, IIdentityProviderCache cache, IOptions<IdentityProviderOptions> options)
    {
      _httpClient = httpClient;

      _cache = cache;

      _options = options.Value;
    }

    public Task<string> LoginAsync()
    {
      return _cache.GetOrCreateAsync(
        "Token",
        async entry =>
        {
          var timestamp = DateTimeOffset.UtcNow;

          using var content = new FormUrlEncodedContent(new[]
          {
            KeyValuePair.Create("grant_type", "client_credentials"),
            KeyValuePair.Create("client_id", _options.ClientId),
            KeyValuePair.Create("client_secret", _options.ClientSecret)
          });

          using var response = await _httpClient.PostAsync("/as/token.oauth2", content);

          response.EnsureSuccessStatusCode();

          using var document = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());

          var expiryInSeconds =
            document
              .RootElement
                .GetProperty("expires_in")
                .GetInt32();

          entry.AbsoluteExpiration = timestamp.AddSeconds(expiryInSeconds - 300);

          return
            document
              .RootElement
                .GetProperty("access_token")
                .GetString();
        });
    }
  }
}
