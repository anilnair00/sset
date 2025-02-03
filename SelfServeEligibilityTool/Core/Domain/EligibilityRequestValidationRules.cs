using System;
using System.Text.RegularExpressions;
using NRules.Fluent.Dsl;
using ODE.SSET.Interfaces.Enums;

namespace ODE.SSET.Core.Domain
{
  #region BRE 10_00_XXX - Metadata
  /// <summary>
  /// Runtime Environment mismatch 
  /// </summary>
  [Tag("Validation")]
  [Tag("ValidationSelfAssessment")]
  public class EligibilityRequestRuntimeEnvironmentRule : Rule
  {
    private readonly int businessRuleCode = 10_00_005;
    public override void Define()
    {
      RuntimeContext runtimeContext = null;
      GatewayResponse gatewayResponse = null;

      When()
          .Match<RuntimeContext>(() => runtimeContext)
          .Match<GatewayResponse>(() => gatewayResponse, r => (r.GatewayRequest.GatewayRequestContext.RuntimeEnvironment != runtimeContext.RuntimeEnvironment));
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.GatewayRequestContext.RuntimeEnvironment),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  /// <summary>
  /// reCaptcha User Response Token must be provided when reCaptcha is enabled
  /// </summary>
  [Tag("Validation")]
  [Tag("ValidationSelfAssessment")]
  public class EligibilityRequestRecaptchaUserResponseTokenRule : Rule
  {
    private readonly int businessRuleCode = 10_00_020;
    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => (r.GatewayRequest.GatewayRequestContext.IsRecaptchaEnabled &&
            string.IsNullOrEmpty(r.GatewayRequest.GatewayRequestContext.RecaptchaResponseToken)));
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.GatewayRequestContext.IsRecaptchaEnabled) + ", " +
                nameof(gatewayResponse.GatewayRequest.GatewayRequestContext.RecaptchaResponseToken),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  /// <summary>
  /// Bypassing reCaptcha in PRD is not allowed
  /// </summary>
  [Tag("Validation")]
  [Tag("ValidationSelfAssessment")]
  public class EligibilityRequestBypassRecaptchaInPRDRule : Rule
  {
    private readonly int businessRuleCode = 10_00_025;
    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => (!r.GatewayRequest.GatewayRequestContext.IsRecaptchaEnabled &&
            r.GatewayRequest.GatewayRequestContext.RuntimeEnvironment == RuntimeEnvironment.PRD));
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.GatewayRequestContext.RuntimeEnvironment) + ", " +
                nameof(gatewayResponse.GatewayRequest.GatewayRequestContext.RecaptchaResponseToken),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  // businessRuleCode = 10_00_030 - Invalid Token (see ValidationService).
  // businessRuleCode = 10_00_035 - reCaptcha Minimum Score (see ValidationService).

  #endregion

  #region BRE 10_10_XXX - PNR
  /// <summary>
  /// PNR too long 
  /// </summary>
  [Tag("Validation")]
  public class EligibilityRequestPnrMaxLengthRule : Rule
  {
    private readonly int businessRuleCode = 10_10_005;
    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => (r.GatewayRequest.EligibilityRequest.PNR != null &&
                                                              r.GatewayRequest.EligibilityRequest.PNR.Length > 6));
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.EligibilityRequest.PNR),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  /// <summary>
  /// PNR too short
  /// </summary>
  [Tag("Validation")]
  public class EligibilityRequestPnrMinLengthRule : Rule
  {
    private readonly int businessRuleCode = 10_10_010;
    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => r.GatewayRequest.EligibilityRequest.PNR != null &&
                                                              r.GatewayRequest.EligibilityRequest.PNR.Length < 6);
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.EligibilityRequest.PNR),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  /// <summary>
  /// PNR contains invalid character(s)
  /// </summary>
  [Tag("Validation")]
  public class EligibilityRequestPnrInvalidCharRule : Rule
  {
    private readonly int businessRuleCode = 10_10_015;

    // Regular expression to check that the PNR contains only letters or numbers
    private readonly string regEx = @"^[A-Z0-9]+$";
    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => !string.IsNullOrEmpty(r.GatewayRequest.EligibilityRequest.PNR) &&
              !Regex.IsMatch(r.GatewayRequest.EligibilityRequest.PNR.ToUpper(), regEx));
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.EligibilityRequest.PNR),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  #endregion

  #region BRE 10_20_XXX - Ticket Number
  /// <summary>
  /// Ticket Number too long 
  /// </summary>
  [Tag("Validation")]
  [Tag("ValidationSelfAssessment")]
  public class EligibilityRequestTicketNumberMaxLengthRule : Rule
  {
    private readonly int businessRuleCode = 10_20_005;
    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => r.GatewayRequest.EligibilityRequest.TicketNumber != null &&
                                                              r.GatewayRequest.EligibilityRequest.TicketNumber.Length > 13);
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.EligibilityRequest.TicketNumber),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  /// <summary>
  /// Ticket Number too short
  /// </summary>
  [Tag("Validation")]
  [Tag("ValidationSelfAssessment")]
  public class EligibilityRequestTicketNumberMinLengthRule : Rule
  {
    private readonly int businessRuleCode = 10_20_010;
    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => r.GatewayRequest.EligibilityRequest.TicketNumber != null &&
                                                              r.GatewayRequest.EligibilityRequest.TicketNumber.Length < 13);
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.EligibilityRequest.TicketNumber),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  /// <summary>
  /// Ticket Number contains invalid character(s)
  /// </summary>
  [Tag("Validation")]
  [Tag("ValidationSelfAssessment")]
  public class EligibilityRequestTicketNumberInvalidCharRule : Rule
  {
    private readonly int businessRuleCode = 10_20_015;

    // Regular expression to check that the Ticket Number contains only numbers
    private readonly string regEx = @"^[0-9]+$";

    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => !string.IsNullOrEmpty(r.GatewayRequest.EligibilityRequest.TicketNumber) &&
              !Regex.IsMatch(r.GatewayRequest.EligibilityRequest.TicketNumber, regEx));
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.EligibilityRequest.TicketNumber),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  #endregion

  #region BRE 10_30_XXX - Flight Date
  // Flight date can go back to December 15th 2019 up to Current date 

  /// <summary>
  /// Flight Date in the future 
  /// </summary>
  [Tag("Validation")]
  public class EligibilityRequestFlightDateFutureRule : Rule
  {
    private readonly int businessRuleCode = 10_30_005;
    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => r.GatewayRequest.EligibilityRequest.FlightDate != null &&
              r.GatewayRequest.EligibilityRequest.FlightDate > DateTimeOffset.Now);
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.EligibilityRequest.FlightDate),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  /// <summary>
  /// Flight Date prior to APPR effective date
  /// </summary>
  [Tag("Validation")]
  public class EligibilityRequestFlightDatePriorAPPRRule : Rule
  {
    private readonly int businessRuleCode = 10_30_010;
    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => r.GatewayRequest.EligibilityRequest.FlightDate != null &&
              r.GatewayRequest.EligibilityRequest.FlightDate < new DateTimeOffset(2019, 12, 15, 0, 0, 0, new TimeSpan(0)) );
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.EligibilityRequest.FlightDate),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  /// <summary>
  /// Flight Date one year old
  /// </summary>
  [Tag("Validation")]
  public class EligibilityRequestFlightDateOneYearOldRule : Rule
  {
    private readonly int businessRuleCode = 10_30_015;
    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => r.GatewayRequest.EligibilityRequest.FlightDate != null &&
              r.GatewayRequest.EligibilityRequest.FlightDate < DateTimeOffset.Now.AddDays(-2).AddYears(-10));
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.EligibilityRequest.FlightDate),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }
  #endregion

  #region BRE 10_40_XXX - First Name
  /// <summary>
  /// First Name too long 
  /// </summary>
  [Tag("Validation")]
  public class EligibilityRequestFirstNameMaxLengthRule : Rule
  {
    private readonly int businessRuleCode = 10_40_005;
    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => r.GatewayRequest.EligibilityRequest.FirstName != null &&
              r.GatewayRequest.EligibilityRequest.FirstName.Length > 50);
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.EligibilityRequest.FirstName),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  /// <summary>
  /// First Name too short
  /// </summary>
  [Tag("Validation")]
  public class EligibilityRequestFirstNameMinLengthRule : Rule
  {
    private readonly int businessRuleCode = 10_40_010;
    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => r.GatewayRequest.EligibilityRequest.FirstName != null &&
              r.GatewayRequest.EligibilityRequest.FirstName.Length < 1);
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.EligibilityRequest.FirstName),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  /// <summary>
  /// First Name contains invalid character(s)
  /// </summary>
  [Tag("Validation")]
  public class EligibilityRequestFirstNameInvalidCharRule : Rule
  {
    private readonly int businessRuleCode = 10_40_015;

    // Regular expression to check that the PNR contains only letters
    private readonly string regEx = @"^([ \u00c0-\u01ffa-zA-Z'-])+$";

    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => !string.IsNullOrEmpty(r.GatewayRequest.EligibilityRequest.FirstName) &&
              !Regex.IsMatch(r.GatewayRequest.EligibilityRequest.FirstName, regEx));
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.EligibilityRequest.FirstName),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  #endregion

  #region BRE 10_50_XXX - Last Name
  /// <summary>
  /// Last Name too long 
  /// </summary>
  [Tag("Validation")]
  [Tag("ValidationSelfAssessment")]
  public class EligibilityRequestLastNameMaxLengthRule : Rule
  {
    private readonly int businessRuleCode = 10_50_005;
    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => r.GatewayRequest.EligibilityRequest.LastName != null &&
              r.GatewayRequest.EligibilityRequest.LastName.Length > 50);
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.EligibilityRequest.LastName),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  /// <summary>
  /// Last Name too short
  /// </summary>
  [Tag("Validation")]
  [Tag("ValidationSelfAssessment")]
  public class EligibilityRequestLastNameMinLengthRule : Rule
  {
    private readonly int businessRuleCode = 10_50_010;
    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => r.GatewayRequest.EligibilityRequest.LastName != null &&
              r.GatewayRequest.EligibilityRequest.LastName.Length < 1);
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.EligibilityRequest.LastName),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  /// <summary>
  /// Last Name contains invalid character(s)
  /// </summary>
  [Tag("Validation")]
  public class EligibilityRequestLastNameInvalidCharRule : Rule
  {
    private readonly int businessRuleCode = 10_50_015;

    // Regular expression to check that the Last Name contains only letters
    private readonly string regEx = @"^([ \u00c0-\u01ffa-zA-Z'-])+$"; 

    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => !string.IsNullOrEmpty(r.GatewayRequest.EligibilityRequest.LastName) &&
              !Regex.IsMatch(r.GatewayRequest.EligibilityRequest.LastName, regEx));
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.EligibilityRequest.LastName),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  [Tag("ValidationSelfAssessment")]
  public class EligibilityRequestLastNameInvalidCharsRule : Rule
  {
    private readonly int businessRuleCode = 10_50_015;

    // Regular expression to check that the Last Name contains only letters
    private readonly string regEx = @"^[-a-zA-Z0-9-.'()]+(\s+[-a-zA-Z0-9-.'()]+)*$";
    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => !string.IsNullOrEmpty(r.GatewayRequest.EligibilityRequest.LastName) &&
              !Regex.IsMatch(r.GatewayRequest.EligibilityRequest.LastName, regEx));
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.EligibilityRequest.LastName),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  #endregion

  #region BRE 10_90_XXX - Other
  /// <summary>
  /// The PNR or Ticket Number must be provided.
  /// </summary>
  [Tag("Validation")]
  public class EligibilityRequestPNRorTicketNumberRule : Rule
  {
    private readonly int businessRuleCode = 10_90_005;
    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => r.GatewayRequest.EligibilityRequest.PNR == null &&
                                                              r.GatewayRequest.EligibilityRequest.TicketNumber == null);
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = string.Join(',',
                (nameof(gatewayResponse.GatewayRequest.EligibilityRequest.PNR)),
                (nameof(gatewayResponse.GatewayRequest.EligibilityRequest.TicketNumber))
                ),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }

  /// <summary>
  /// The Ticket Number must be provided.
  /// </summary>
  [Tag("ValidationSelfAssessment")]
  public class EligibilityRequestTicketNumberRule : Rule
  {
    private readonly int businessRuleCode = 10_90_005;
    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => r.GatewayRequest.EligibilityRequest.TicketNumber == null);
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = nameof(gatewayResponse.GatewayRequest.EligibilityRequest.TicketNumber),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }


  /// <summary>
  /// The PNR and Ticket Number must be mutually exclusive.
  /// </summary>
  [Tag("Validation")]
  public class EligibilityRequestMutexPNRTicketNumberRule : Rule
  {
    private readonly int businessRuleCode = 10_90_010;
    public override void Define()
    {
      GatewayResponse gatewayResponse = null;

      When()
          .Match<GatewayResponse>(() => gatewayResponse, r => r.GatewayRequest.EligibilityRequest.PNR != null &&
                                                              r.GatewayRequest.EligibilityRequest.TicketNumber != null);
      Then()
          .Do(ctx => gatewayResponse.GatewayRequest.GatewayRequestContext.AddValidationResult(
            new ValidationException()
            {
              PropertyName = string.Join(',',
                (nameof(gatewayResponse.GatewayRequest.EligibilityRequest.PNR)),
                (nameof(gatewayResponse.GatewayRequest.EligibilityRequest.TicketNumber))
                ),
              BusinessRuleCode = businessRuleCode
            }
            ));
    }
  }
  #endregion
}
