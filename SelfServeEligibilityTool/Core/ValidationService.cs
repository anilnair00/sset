using Microsoft.Extensions.Options;
using ODE.SSET.Core.BRE;
using ODE.SSET.Core.Domain;
using ODE.SSET.Core.Recaptcha;
using System.Diagnostics;
using System.Threading.Tasks;

namespace ODE.SSET.Core
{
  public class ValidationService
  {
    private readonly IOptions<RecaptchaOptions> _options;
    private readonly RuntimeContext runtimeContext;
    private readonly RuleEngine ruleEngine;
    private readonly VerificationService verificationService;

    public ValidationService(
      IOptions<RecaptchaOptions> options,
      RuntimeContext injectedRuntimeContext, 
      RuleEngine injectedRuleEngine, 
      VerificationService verificationService)
    {
      _options = options;
      runtimeContext = injectedRuntimeContext;
      ruleEngine = injectedRuleEngine;
      this.verificationService = verificationService;
    }

    public async Task<GatewayResponse> Run(GatewayRequest gatewayRequest, bool dynamicsIntegration)
    {
      Debug.WriteLine("SSET: Request Message Validation.");

      var gatewayResponse = new GatewayResponse()
      {
        GatewayRequest = gatewayRequest,
        EligibilityResponse = new EligibilityResponse()
      };

      if (!dynamicsIntegration)
      {
        //Load domain model by inserting facts into rules engine's memory
        ruleEngine.ValidationSession.Insert(runtimeContext);
        ruleEngine.ValidationSession.Insert(gatewayResponse);

        //Start match/resolve/act cycle
        ruleEngine.ValidationSession.Fire();
      }
      else
      {
        //Load domain model by inserting facts into rules engine's memory
        ruleEngine.ValidationSelfAssessmentSession.Insert(runtimeContext);
        ruleEngine.ValidationSelfAssessmentSession.Insert(gatewayResponse);

        //Start match/resolve/act cycle
        ruleEngine.ValidationSelfAssessmentSession.Fire();
      }

      if (gatewayRequest.GatewayRequestContext.IsRecaptchaEnabled && gatewayResponse.GatewayRequest.GatewayRequestContext.ValidationExceptions.Count == 0)
      {
        // reCaptcha User Response Token Validation
        int businessRuleCode = 10_00_030;

        VerificationResponse verificationResponse = await verificationService.Run(gatewayRequest);

        if (!(verificationResponse?.Success ?? true))
        {
          gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.GatewayRequestContext.RecaptchaResponseToken),
              BusinessRuleCode = businessRuleCode
            });

          gatewayResponse.ExceptionMessage += $"[reCaptcha Error Message: {string.Join(", ", verificationResponse.ErrorCodes)}]";
        }

        // reCaptcha Minimum Score Validation
        businessRuleCode = 10_00_035;

        if (verificationResponse?.Score < (float)_options.Value.Threshold)
        {
          gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = "reCaptcha Score",
              BusinessRuleCode = businessRuleCode
            });
        }
      }

      return gatewayResponse;
    }
  }
}
