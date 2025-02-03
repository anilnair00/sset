using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using ODE.SSET.Core.Domain;

namespace ODE.SSET.Core.Recaptcha
{
  public class VerificationService
  {
    private readonly IOptions<RecaptchaOptions> _options;
    private readonly HttpClient _httpClient;

    public VerificationService(IOptions<RecaptchaOptions> options, HttpClient httpClient)
    {
      _options = options;
      _httpClient = httpClient;
    }

    public async Task<VerificationResponse> Run(GatewayRequest gatewayRequest)
    {
      var options = _options.Value;

      if (!gatewayRequest.GatewayRequestContext.IsRecaptchaEnabled)
      {
        return null;
      }

      var recaptchaUrl = $"siteverify?secret={options.SecretKey}&response={gatewayRequest.GatewayRequestContext.RecaptchaResponseToken}";
      var httpResponse = await _httpClient.GetAsync(recaptchaUrl);
      var httpResponseContent = await httpResponse.Content.ReadAsStringAsync();

      if (!httpResponse.IsSuccessStatusCode)
      {
        throw new Exception($"Error while sending request to reCAPTCHA service. {httpResponseContent}");
      }

      var jsonOptions = new JsonSerializerOptions()
      {
        PropertyNameCaseInsensitive = true
      };
      VerificationResponse verificationResponse = JsonSerializer.Deserialize<VerificationResponse>(httpResponseContent, jsonOptions);
      
      return verificationResponse;
    }

    public async Task<VerificationResponse> Run(string recaptchaResponseToken, CancellationToken cancellationToken)
    {
      var options = _options.Value;

      var recaptchaUrl = $"siteverify?secret={options.SecretKey}&response={recaptchaResponseToken}";
      var httpResponse = await _httpClient.GetAsync(recaptchaUrl, cancellationToken);
      var httpResponseContent = await httpResponse.Content.ReadAsStringAsync();

      if (!httpResponse.IsSuccessStatusCode)
      {
        throw new Exception($"Error while sending request to reCAPTCHA service. {httpResponseContent}");
      }

      var jsonOptions = new JsonSerializerOptions()
      {
        PropertyNameCaseInsensitive = true
      };
      VerificationResponse verificationResponse = JsonSerializer.Deserialize<VerificationResponse>(httpResponseContent, jsonOptions);

      return verificationResponse;
    }

  }
}
