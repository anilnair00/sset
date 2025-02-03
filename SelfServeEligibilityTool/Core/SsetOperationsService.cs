namespace ODE.SSET.Core
{
  using AirCanada.ODE.CIP.APIClient;
  using Azure;
  using Azure.Storage;
  using Azure.Storage.Blobs;
  using Azure.Storage.Blobs.Models;
  using Microsoft.Extensions.Caching.Memory;
  using Microsoft.Extensions.Options;
  using ODE.SSET.Core.MalwareScanning;
  using ODE.SSET.Core.Recaptcha;
  using ODE.SSET.Interfaces;
  using ODE.SSET.Interfaces.Dynamics;
  using ODE.SSET.Interfaces.MalwareScanning;
  using System;
  using System.Collections.Generic;
  using System.Globalization;
  using System.IO;
  using System.Linq;
  using System.Text;
  using System.Text.RegularExpressions;
  using System.Threading;
  using System.Threading.Tasks;

  public class SsetOperationsService : ISsetOperationsService
  {
    private const int BR_Recaptcha_ResponseCode_NullOrEmpty = 10_00_020;
    private const int BR_Recaptcha_ResponseCode_Invalid = 10_00_030;
    private const int BR_Recaptcha_ResponseCode_Minimum_Threshold = 10_00_035;

    private const int BR_PassengerFlightDetails_NullOrEmpty = 15_00_010;
    private const int BR_PassengerFlightDetails_Invalid = 15_00_020;

    private const string LanguagesCacheName = "Languages";
    private const string TitlesCacheName = "Titles";
    private const string CountriesCacheName = "Countries";
    private const string AirportsCacheName = "Airports";
    private const string StarAllianceTiersCacheName = "StarAllianceTiers";
    private const string ProvincesCacheName = "Provinces";
    private const string RegimesCacheName = "Regimes";
    private const string RelationshipsCacheName = "Relationships";
    private const string ExpenseTypesCacheName = "ExpenseTypes";
    private const string MealTypesCacheName = "MealTypes";
    private const string OverrideOptionCacheName = "OverrideOptions";
    private const string CurrenciesCacheName = "Currencies";
    private const string TransportationTypesCacheName = "TransportationTypes";

    private readonly IOptions<RecaptchaOptions> _options;
    private readonly BlobServiceClient _blobServiceClient;
    private readonly VerificationService _verificationService;
    private readonly ISsetOperationsClient _ssetOperationsClient;
    private readonly IMemoryCache _memoryCache;
    private readonly TimeSpan _cacheExpiration = TimeSpan.FromHours(24);

    public SsetOperationsService(IOptions<RecaptchaOptions> options,
      BlobServiceClient blobServiceClient,
      ISsetOperationsClient ssetOperationsClient,
      VerificationService verificationService, 
      IMemoryCache memoryCache)
    {
      _options = options;
      _blobServiceClient = blobServiceClient;
      _verificationService = verificationService;
      _ssetOperationsClient = ssetOperationsClient;
      _memoryCache = memoryCache;
    }

    public async Task<IEnumerable<ILanguageModel>> GetLanguagesAsync(CancellationToken cancellationToken)
    {
      return await _memoryCache.GetOrCreateAsync(LanguagesCacheName, async entry =>
      {
        var searchResults = await _ssetOperationsClient.GetLanguagesAsync(null, null, cancellationToken);

        if (searchResults != null && searchResults.TotalCount > 0)
        {
          return searchResults.Items.Select(s => new Domain.LanguageModel
          {
            Id = s.Id.Value,
            Code = s.Code,
            Description = s.Description,
            DynamicsId = s.DynamicsId.Value
          }).ToList();
        }

        entry.SetOptions(new MemoryCacheEntryOptions()
          .SetPriority(CacheItemPriority.Normal)
          .SetAbsoluteExpiration(_cacheExpiration));

        return null;
      });
    }

    public async Task<IEnumerable<ITitleModel>> GetTitlesAsync(string languageCode, CancellationToken cancellationToken)
    {
      var cacheKey = $@"{TitlesCacheName}{languageCode}";
      return await _memoryCache.GetOrCreateAsync(cacheKey, async entry =>
      {
        var searchResults = await _ssetOperationsClient.GetTitlesAsync(languageCode, null, null, cancellationToken);

        if (searchResults != null && searchResults.TotalCount > 0)
        {
          return searchResults.Items.Select(s => new Domain.TitleModel
          {
            Id = s.Id.Value,
            LanguageCode = s.LanguageCode,
            Description = s.Description,
            DynamicsId = s.DynamicsId.Value
          }).ToList();
        }

        entry.SetOptions(new MemoryCacheEntryOptions()
            .SetPriority(CacheItemPriority.Normal)
            .SetAbsoluteExpiration(_cacheExpiration));

        return null;
      });
    }

    public async Task<IEnumerable<IRelationshipModel>> GetRelationshipsAsync(string languageCode, CancellationToken cancellationToken)
    {
      var cacheKey = $@"{RelationshipsCacheName}{languageCode}";
      return await _memoryCache.GetOrCreateAsync(cacheKey, async entry =>
      {
        var searchResults = await _ssetOperationsClient.GetRelationshipsAsync(languageCode, null, null, cancellationToken);

        if (searchResults != null && searchResults.TotalCount > 0)
        {
          return searchResults.Items.Select(s => new Domain.RelationshipModel
          {
            Id = s.Id.Value,
            LanguageCode = s.LanguageCode,
            Description = s.Description,
            DynamicsId = s.DynamicsId.Value
          }).ToList();
        }

        entry.SetOptions(new MemoryCacheEntryOptions()
             .SetPriority(CacheItemPriority.Normal)
             .SetAbsoluteExpiration(_cacheExpiration));

        return null;
      });
    }

    public async Task<IEnumerable<IExpenseTypeModel>> GetExpenseTypesAsync(string languageCode, CancellationToken cancellationToken)
    {
      var cacheKey = $@"{ExpenseTypesCacheName}{languageCode}";
      return await _memoryCache.GetOrCreateAsync(cacheKey, async entry =>
      {
        var searchResults = await _ssetOperationsClient.GetExpenseTypesAsync(languageCode, null, null, cancellationToken);

        if (searchResults != null && searchResults.TotalCount > 0)
        {
          return searchResults.Items.Select(s => new Domain.ExpenseTypeModel
          {
            Id = s.Id.Value,
            LanguageCode = s.LanguageCode,
            Description = s.Description,
            DynamicsId = s.DynamicsId.Value
          }).ToList();
        }

        entry.SetOptions(new MemoryCacheEntryOptions()
             .SetPriority(CacheItemPriority.Normal)
             .SetAbsoluteExpiration(_cacheExpiration));

        return null;
      });
    }

    public async Task<IEnumerable<IMealTypeModel>> GetMealTypesAsync(string languageCode, CancellationToken cancellationToken)
    {
      var cacheKey = $@"{MealTypesCacheName}{languageCode}";
      return await _memoryCache.GetOrCreateAsync(cacheKey, async entry =>
      {
        var searchResults = await _ssetOperationsClient.GetMealTypesAsync(languageCode, null, null, cancellationToken);

        if (searchResults != null && searchResults.TotalCount > 0)
        {
          return searchResults.Items.Select(s => new Domain.MealTypeModel
          {
            Id = s.Id.Value,
            LanguageCode = s.LanguageCode,
            Description = s.Description,
            DynamicsId = s.DynamicsId.Value
          }).ToList();
        }

        entry.SetOptions(new MemoryCacheEntryOptions()
             .SetPriority(CacheItemPriority.Normal)
             .SetAbsoluteExpiration(_cacheExpiration));

        return null;
      });
    }

    public async Task<IEnumerable<ICountryModel>> GetCountriesAsync(string languageCode, CancellationToken cancellationToken)
    {
      var cacheKey = $@"{CountriesCacheName}{languageCode}";
      return await _memoryCache.GetOrCreateAsync(cacheKey, async entry =>
      {
        var searchResults = await _ssetOperationsClient.GetCountriesAsync(languageCode, null, null, cancellationToken);

        if (searchResults != null && searchResults.TotalCount > 0)
        {
          return searchResults.Items.Select(s => new Domain.CountryModel
          {
            Id = s.Id.Value,
            LanguageCode = s.LanguageCode,
            Code = s.Code,
            Description = s.Description,
            DynamicsId = s.DynamicsId.Value,
            SortOrder = s.SortOrder.Value
          }).ToList();
        }

        entry.SetOptions(new MemoryCacheEntryOptions()
              .SetPriority(CacheItemPriority.Normal)
              .SetAbsoluteExpiration(_cacheExpiration));

        return null;
      });
    }

    public async Task<IEnumerable<IAirportModel>> GetAirportsAsync(string languageCode, IEnumerable<string> airportCodes, CancellationToken cancellationToken)
    {
      StringBuilder cacheKey = new StringBuilder($@"{AirportsCacheName}{languageCode}");

      if (airportCodes != null)
      {
        foreach (var airportCode in airportCodes)
        {
          cacheKey.Append(airportCode);
        }
      }

      return await _memoryCache.GetOrCreateAsync(cacheKey.ToString(), async entry =>
      {
        var searchResults = await _ssetOperationsClient.GetAirportsAsync(airportCodes, null, null, cancellationToken);

        if (searchResults != null && searchResults.TotalCount > 0)
        {
          //Supported language codes
          var englishLanguageCode = "en-ca";
          var frenchLanguageCode = "fr-ca";

          //Filter out airports that do not have a DynamicsId
          return searchResults
            .Items
            .Where(w => w.DynamicsId.HasValue && !w.DynamicsId.Value.Equals(Guid.Empty))
            .Select(s => new Domain.AirportModel
            {
              LanguageCode = languageCode,
              AirportCode = s.AirportCode,
              ShortName = languageCode.ToLower().Equals(englishLanguageCode) ? s.ShortNameEn : languageCode.ToLower().Equals(frenchLanguageCode) ? s.ShortNameFr : "",
              AirportName = languageCode.ToLower().Equals(englishLanguageCode) ? s.AirportNameEn : languageCode.ToLower().Equals(frenchLanguageCode) ? s.AirportNameFr : "",
              CityName = languageCode.ToLower().Equals(englishLanguageCode) ? s.CityNameEn : languageCode.ToLower().Equals(frenchLanguageCode) ? s.CityNameFr : "",
              CountryCode = s.CountryCode,
              CountryName = languageCode.ToLower().Equals(englishLanguageCode) ? s.CountryNameEn : languageCode.ToLower().Equals(frenchLanguageCode) ? s.CountryNameFr : "",
              ProvinceCode = s.ProvinceCode,
              ProvinceName = languageCode.ToLower().Equals(englishLanguageCode) ? s.ProvinceNameEn : languageCode.ToLower().Equals(frenchLanguageCode) ? s.ProvinceNameFr : "",
              Latitude = s.Latitude,
              Longitude = s.Longitude,
              RetrievedAt = s.RetrievedAt,
              ExpireAt = s.ExpireAt,
              ServiceEnvironment = s.ServiceEnvironment,
              TimeZone = s.TimeZone,
              UniqueIdentifier = s.UniqueIdentifier,
              DynamicsId = s.DynamicsId.Value
            }).ToList();
        }

        entry.SetOptions(new MemoryCacheEntryOptions()
                .SetPriority(CacheItemPriority.Normal)
                .SetAbsoluteExpiration(_cacheExpiration));

        return null;
      });
    }

    public async Task<IEnumerable<IStarAllianceTierModel>> GetStarAllianceTiersAsync(string languageCode, CancellationToken cancellationToken)
    {
      var cacheKey = $@"{StarAllianceTiersCacheName}{languageCode}";
      return await _memoryCache.GetOrCreateAsync(cacheKey, async entry =>
      {
        var searchResults = await _ssetOperationsClient.GetStarAllianceTiersAsync(languageCode, null, null, cancellationToken);

        if (searchResults != null && searchResults.TotalCount > 0)
        {
          return searchResults.Items.Select(s => new Domain.StarAllianceTierModel
          {
            Id = s.Id.Value,
            LanguageCode = s.LanguageCode,
            Description = s.Description,
            DynamicsId = s.DynamicsId.Value,
          }).ToList();
        }

        entry.SetOptions(new MemoryCacheEntryOptions()
              .SetPriority(CacheItemPriority.Normal)
              .SetAbsoluteExpiration(_cacheExpiration));

        return null;
      });
    }

    public async Task<IEnumerable<IProvinceModel>> GetProvincesAsync(string languageCode, string countryCode, CancellationToken cancellationToken)
    {
      var cacheKey = $@"{ProvincesCacheName}{languageCode}{countryCode}";
      return await _memoryCache.GetOrCreateAsync(cacheKey, async entry =>
      {
        var searchResults = await _ssetOperationsClient.GetProvincesAsync(languageCode, countryCode, null, null, cancellationToken);

        if (searchResults != null && searchResults.TotalCount > 0)
        {
          return searchResults.Items.Select(s => new Domain.ProvinceModel
          {
            Id = s.Id.Value,
            Code = s.Code,
            Description = s.Description,
            LanguageCode = s.LanguageCode,
            CountryCode = s.CountryCode,
          }).ToList();
        }

        entry.SetOptions(new MemoryCacheEntryOptions()
              .SetPriority(CacheItemPriority.Normal)
              .SetAbsoluteExpiration(_cacheExpiration));

        return null;
      });
    }

    public async Task<IEnumerable<ICurrencyModel>> GetCurrenciesAsync(string languageCode, CancellationToken cancellationToken)
    {
      var cacheKey = $@"{CurrenciesCacheName}{languageCode}";
      return await _memoryCache.GetOrCreateAsync(cacheKey, async entry =>
      {
        var searchResults = await _ssetOperationsClient.GetCurrenciesAsync(languageCode, null, null, cancellationToken);

        if (searchResults != null && searchResults.TotalCount > 0)
        {
          return searchResults.Items.Select(s => new Domain.CurrencyModel
          {
            Id = (int)s.Id,
            Code = s.Code,
            Symbol = s.Symbol,
            Description = s.Description,
            DynamicsId = (Guid)s.DynamicsId,
            SortOrder = (int)s.SortOrder,
            LanguageCode = s.LanguageCode,
          }).ToList();
        }

        entry.SetOptions(new MemoryCacheEntryOptions()
              .SetPriority(CacheItemPriority.Normal)
              .SetAbsoluteExpiration(_cacheExpiration));

        return null;
      });
    }


    public async Task<ISsetResponse> ValidateRecaptcha(ISsetRequest ssetRequest, CancellationToken cancellationToken)
    {
      var ssetResponse = new Domain.Dynamics.SsetResponse()
      {
        ReCaptchaValidationResults = new List<Domain.Dynamics.SsetValidationException>()
      };

      // reCaptcha User Response Token Validation
      if (ssetRequest == null || string.IsNullOrEmpty(ssetRequest.RecaptchaResponseToken))
      {
        ssetResponse.ExceptionMessage = "Invalid or missing reCaptcha Response Token.";
        ssetResponse.ReCaptchaValidationResults = ssetResponse.ReCaptchaValidationResults.Append(new Domain.Dynamics.SsetValidationException()
        {
          PropertyName = "RecaptchaResponseToken",
          BusinessRuleCode = BR_Recaptcha_ResponseCode_NullOrEmpty,
          ValidationMessage = ssetResponse.ExceptionMessage
        });
      }

      if (ssetResponse.ReCaptchaValidationResults.Count() == 0)
      {
        VerificationResponse verificationResponse = await _verificationService.Run(ssetRequest.RecaptchaResponseToken, cancellationToken);

        if (!(verificationResponse?.Success ?? true))
        {
          ssetResponse.ExceptionMessage += $"[reCaptcha Error Message: {string.Join(", ", verificationResponse.ErrorCodes)}]";
          ssetResponse.ReCaptchaValidationResults = ssetResponse.ReCaptchaValidationResults.Append(
            new Domain.Dynamics.SsetValidationException()
            {
              PropertyName = "RecaptchaResponseToken",
              BusinessRuleCode = BR_Recaptcha_ResponseCode_Invalid,
              ValidationMessage = ssetResponse.ExceptionMessage
            });
        }

        // reCaptcha Minimum Score Validation
        if (verificationResponse?.Score < (float)_options.Value.Threshold)
        {
          ssetResponse.ExceptionMessage += $"[reCaptcha Score validation failed]";
          ssetResponse.ReCaptchaValidationResults = ssetResponse.ReCaptchaValidationResults.Append(
            new Domain.Dynamics.SsetValidationException()
            {
              PropertyName = "reCaptcha Score",
              BusinessRuleCode = BR_Recaptcha_ResponseCode_Minimum_Threshold,
              ValidationMessage = "[reCaptcha Score validation failed]"
            });
        }
      }

      return ssetResponse;
    }

    public async Task<ISsetResponse> CreateDynamicsWebRequest(ISsetRequest ssetRequest, CancellationToken cancellationToken)
    {
      Domain.Dynamics.SsetResponse response = new Domain.Dynamics.SsetResponse()
      {
        BusinessRuleValidationResults = new List<Domain.Dynamics.SsetValidationException>()
      };

      try
      {
        var request = new SsetRequest()
        {
          SessionId = ssetRequest.SessionId,
          Passengers = ssetRequest.Passengers?.Select(p => new SsetPassenger()
          {
            IsPrimaryApplicant = p.IsPrimaryApplicant,
            TitleDynamicsId = p.TitleDynamicsId,
            CountryDynamicsId = p.CountryDynamicsId,
            FirstName = p.FirstName,
            LastName = p.LastName,
            AddressStreet = p.AddressStreet,
            IsAddressSameAsPrimaryApplicant = p.IsAddressSameAsPrimaryApplicant,
            City = p.City,
            ProvinceState = p.ProvinceState,
            ZipCode = p.ZipCode,
            PrimaryPhone = p.PrimaryPhone,
            MobilePhone = p.MobilePhone,
            Email = p.Email,
            ConfirmEmail = p.ConfirmEmail,
            AeroPlanNumber = p.AeroPlanNumber,
            AcStarAllianceTierDynamicsId = p.ACStarAllianceTierDynamicsId,
            IsClaimingCompensation = p.IsClaimingCompensation,
            IsClaimingExpenses = p.IsClaimingExpenses,
            TicketNumber = p.TicketNumber
          }).ToList(),
          OriginDestinations = ssetRequest.OriginDestinations?.Select(o => new SsetOriginDestination()
          {
            AssessmentId = o.AssessmentId,
            FlightNumber = o.FlightNumber,
            FlightDate = o.FlightDate,
            PnrNumber = o.PnrNumber,
            DepartureAirportCode = o.DepartureAirportCode,
            ArrivalAirportCode = o.ArrivalAirportCode,
            IsEuRegulation = o.IsEuRegulation,
            Expenses = o.Expenses?.Select(e => new SsetExpense()
            {
              ExpenseTypeDynamicsId = e.ExpenseTypeDynamicsId,
              MealTypeDynamicsId = e.MealTypeDynamicsId,
              TransportationTypeDynamicsId = e.TransportationTypeDynamicsId,
              TransactionDate = e.TransactionDate,
              DisruptionCityAirportCode = e.DisruptionCityAirportCode,
              CheckInDate = e.CheckInDate,
              CheckOutDate = e.CheckOutDate,              
              CurrencyCode = e.CurrencyCode,
              Amount = e.Amount,
              Receipts = e.Receipts?.Select(r => new SsetReceipt()
              {
                FileName = r.FileName,
                MimeType = r.MimeType,
                DocumentBody = r.DocumentBody,
              }).ToList(),
            }).ToList(),
          }).ToList(),
          PortalLanguageDynamicsId = ssetRequest.PortalLanguageDynamicsId,
          IsManualFlow = ssetRequest.IsManualFlow,
        };

        var ssetResponse = await _ssetOperationsClient.CreateWebRequestAsync(null, null, request, cancellationToken);

        response = new Domain.Dynamics.SsetResponse()
        {
          OriginDestinations = ssetResponse.OriginDestinations?.Select(o => new Domain.Dynamics.SsetOriginDestinationResponse()
          {
            FlightNumber = o.FlightNumber,
            FlightDate = o.FlightDate.HasValue ? o.FlightDate.Value.LocalDateTime : DateTime.MinValue,
            DepartureAirportCode = o.DepartureAirportCode,
            ArrivalAirportCode = o.ArrivalAirportCode,
            PnrNumber = o.PnrNumber,
            Passengers = o.Passengers?.Select(p => new Domain.Dynamics.SsetPassengerResponse()
            {
              IsPrimaryApplicant = (bool)p.IsPrimaryApplicant,
              IsClaimingCompensation = (bool)p.IsClaimingCompensation,
              IsClaimingExpenses = (bool)p.IsClaimingExpenses,
              TicketNumber = p.TicketNumber,
              FirstName = p.FirstName,
              LastName = p.LastName,
              PrimaryPhone = p.PrimaryPhone,
              Email = p.Email,
              CompensationClaimWebRequestResponse = p.CompensationClaimWebResult != null ? new Domain.Dynamics.SsetWebRequestResponse()
              {
                DynamicsWebRequestId = p.CompensationClaimWebResult?.DynamicsWebRequestId,
                IsSuccessful = p.CompensationClaimWebResult != null && (bool)p.CompensationClaimWebResult.IsSuccessful,
              } : null,
              ExpenseClaimWebRequestResponse = p.ExpenseClaimWebResult != null ? new Domain.Dynamics.SsetWebRequestResponse()
              {
                DynamicsWebRequestId = p.ExpenseClaimWebResult?.DynamicsWebRequestId,
                IsSuccessful = p.ExpenseClaimWebResult != null && (bool)p.ExpenseClaimWebResult.IsSuccessful,
              } : null,
              ExpenseResponse = p.ExpenseClaimResult != null ? new Domain.Dynamics.SsetExpenseResponse()
              {
                ExpenseTypeDynamicsId = (long)p.ExpenseClaimResult.ExpenseTypeDynamicsId,
                CurrencyCode = p.ExpenseClaimResult.CurrencyCode,
                Amount = (decimal)p.ExpenseClaimResult.Amount,
                DynamcisExpenseWebRequestId = p.ExpenseClaimResult.DynamcisExpenseWebRequestId,
                IsSuccessful = (bool)p.ExpenseClaimResult.IsSuccessful,
                ReceiptResponses = p.ExpenseClaimResult.Documents?.Select(d => new Domain.Dynamics.SsetExpenseReceiptResponse()
                {
                  DynamicsAnnotationWebRequestId = d.DynamicsAnnotationWebRequestId,
                  IsSuccessful = (bool)d.IsSuccessful,
                  FileName = d.FileName,
                  MimeType = d.MimeType,
                  Subject = d.Subject,
                }).ToList(),
              } : null,
            }),
            AddidtionalPassengers = o.AdditionalPassengers?.Select(p => new Domain.Dynamics.SsetAddidtionalPassengerResponse()
            {
              FirstName = p.FirstName,
              LastName = p.LastName,
              TicketNumber = p.TicketNumber,
              Email = p.Email,
              DynamcisExpenseAdditionalPassengerWebRequestId = p.DynamicsExpenseAdditionalPassengerWebRequestId,
              IsSuccessful = (bool)p.IsSuccessful,
              ErrorDetails = p.ErrorDetails
            })
          })
        };

        return response;
      }
      catch (ApiException<ValidationProblemDetails> ve)
      {
        response.ExceptionMessage = @$"{ve.Result.Detail}";

        if (ve.Result.Errors != null)
        {
          foreach(var error in ve.Result.Errors)
          {
            foreach(var errorMessage in error.Value)
            { 
              var errorDetails = GetBusinessRuleErrorDetails(errorMessage);
              response.BusinessRuleValidationResults = response.BusinessRuleValidationResults.Append(new Domain.Dynamics.SsetValidationException()
              {
                BusinessRuleCode = errorDetails.Item1,
                PropertyName = errorDetails.Item2,
                ValidationMessage = errorMessage
              });
            }
          }
        }

        if (ve.Result.Detail != null)
        {
          var errors = ve.Result.Detail.Split(new string[] { "\r\n" }, StringSplitOptions.None);

          foreach (var error in errors.Skip(1))
          {
            var errorDetails = GetBusinessRuleErrorDetails(error);
            response.BusinessRuleValidationResults = response.BusinessRuleValidationResults.Append(new Domain.Dynamics.SsetValidationException()
            {
              BusinessRuleCode = errorDetails.Item1,
              PropertyName = errorDetails.Item2,
              ValidationMessage = error
            });
          }
        }

        return response;
      }
      catch
      {
        throw;
      }
    }

    public async Task<IEnumerable<IRegimeModel>> GetRegimesAsync(CancellationToken cancellationToken)
    {
      return await _memoryCache.GetOrCreateAsync(RegimesCacheName, async entry =>
      {
        var searchResults = await _ssetOperationsClient.GetRegimesAsync(null, null, cancellationToken);

        if (searchResults != null && searchResults.TotalCount > 0)
        {
          return searchResults.Items.Select(s => new Domain.RegimeModel
          {
            Id = s.Id,
            Code = s.RegimeCode,           
          }).ToList();
        }

        entry.SetOptions(new MemoryCacheEntryOptions()
          .SetPriority(CacheItemPriority.Normal)
          .SetAbsoluteExpiration(_cacheExpiration));

        return null;
      });
    }

    public async Task<IEnumerable<IOverrideOptionModel>> GetOverrideOptionsAsync(CancellationToken cancellationToken)
    {
      return await _memoryCache.GetOrCreateAsync(OverrideOptionCacheName, async entry =>
      {
        var searchResults = await _ssetOperationsClient.GetOverrideOptionsAsync(null, null, cancellationToken);

        if (searchResults != null && searchResults.TotalCount > 0)
        {
          return searchResults.Items.Select(s => new Domain.OverrideOptionModel
          {
            Id = s.Id,
            Code = s.OverrideOptionCode,
          }).ToList();
        }

        entry.SetOptions(new MemoryCacheEntryOptions()
          .SetPriority(CacheItemPriority.Normal)
          .SetAbsoluteExpiration(_cacheExpiration));

        return null;
      });
    }

    public async Task<IEnumerable<ITransportationTypeModel>> GetTransportationTypesAsync(string languageCode, CancellationToken cancellationToken)
    {
      var cacheKey = $@"{TransportationTypesCacheName}{languageCode}";
      return await _memoryCache.GetOrCreateAsync(cacheKey, async entry =>
      {
        var searchResults = await _ssetOperationsClient.GetTransportationTypesAsync(languageCode, null, null, cancellationToken);

        if (searchResults != null && searchResults.TotalCount > 0)
        {
          return searchResults.Items.Select(s => new Domain.TransportationTypeModel
          {
            Id = s.Id.Value,
            LanguageCode = s.LanguageCode,
            Description = s.Description,
            DynamicsId = s.DynamicsId.Value
          }).ToList();
        }

        entry.SetOptions(new MemoryCacheEntryOptions()
             .SetPriority(CacheItemPriority.Normal)
             .SetAbsoluteExpiration(_cacheExpiration));

        return null;
      });
    }

    public async Task<IReceiptUploadResponse> UploadReceiptFileAsync(IReceiptUploadRequest receiptRequest, CancellationToken cancellationToken)
    {
      var response = new ReceiptUploadResponse();

      try
      {
        #region Create blob container with the ticket number if it does not exist
        var container = _blobServiceClient.GetBlobContainerClient(receiptRequest.TicketNumber);
        await container.CreateIfNotExistsAsync(publicAccessType: PublicAccessType.None, cancellationToken: cancellationToken);
        #endregion

        #region Create a BlobClient to upload file to the container
        BlobClient client;

        if (string.IsNullOrEmpty(receiptRequest.FolderName))
        {
          client = container.GetBlobClient(receiptRequest.File.FileName);
        }
        else
        {
          client = container.GetBlobClient($"{receiptRequest.FolderName}/{receiptRequest.File.FileName}");
        }

        #endregion

        #region Upload the file to the blob container
        var transferOptions = new StorageTransferOptions
        {
          // Set the maximum number of parallel transfer workers
          MaximumConcurrency = 2,

          // Set the initial transfer length to 5 MiB
          InitialTransferSize = 5 * 1024 * 1024,

          // Set the maximum length of a transfer to 3 MiB
          MaximumTransferSize = 3 * 1024 * 1024
        };

        var uploadOptions = new BlobUploadOptions()
        {
          TransferOptions = transferOptions,
          Conditions = new BlobRequestConditions()
          {
            IfNoneMatch = new ETag("*")
          }
        };

        using (var ms = new MemoryStream())
        {
          await receiptRequest.File.CopyToAsync(ms);
          ms.Seek(0, SeekOrigin.Begin);
          var fileInfo = await client.UploadAsync(ms, uploadOptions, cancellationToken);

          response.IsSuccessful = true;
          response.Message = "Success";
        }
        #endregion
      }
      catch (System.Exception ex)
      {
        response.IsSuccessful = false;
        response.Message = ex.Message;
      }

      return response;
    }

    public async Task<IEnumerable<IReceiptDeleteResponse>> DeleteReceiptFileAsync(IReceiptDeleteRequest receiptDeleteRequest, CancellationToken cancellationToken)
    {
      var response = new List<IReceiptDeleteResponse>();

      try
      {
        var container = _blobServiceClient.GetBlobContainerClient(receiptDeleteRequest.TicketNumber);

        #region If no file names are provided, add all files from the container in the list of files to be deleted
        if (receiptDeleteRequest.FileNames == null || receiptDeleteRequest.FileNames.Count() == 0)
        {
          receiptDeleteRequest.FileNames = new List<string>();

          var blobs = container.GetBlobsAsync(cancellationToken: cancellationToken);

          await foreach (var blob in blobs)
          {
            receiptDeleteRequest.FileNames = receiptDeleteRequest.FileNames.Append(blob.Name);
          }
        }
        #endregion

        #region Delete all file from the list of files to be deleted
        foreach (var fileName in receiptDeleteRequest.FileNames)
        {
          var blobClient = container.GetBlobClient(fileName);
          await blobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots, null, cancellationToken);

          response.Add(new ReceiptDeleteResponse()
          {
            FileName = fileName,
            IsSuccessful = true,
          });
        }
        #endregion

        #region Delete the container if there are no files left in the container
        var remainingBlobs = container.GetBlobs();

        if (remainingBlobs.Count() == 0)
        {
          await container.DeleteAsync(cancellationToken: cancellationToken);
        }
        #endregion
      }
      catch (System.Exception ex)
      {
        response.Add(new ReceiptDeleteResponse()
        {
          FileName = ex.Message,
          IsSuccessful = false,
        });
      }

      return response;
    }

    public async Task<IReceiptScanResponse> GetReceiptScanResponseAsync(IReceiptScanRequest receiptScanRequest, CancellationToken cancellationToken)
    {
      var response = new ReceiptScanResponse()
      {
        TicketNumber = receiptScanRequest.TicketNumber,
        ScanResults = new List<IScanResult>()
      };

      try
      {
        var blobContainerClient = _blobServiceClient.GetBlobContainerClient(receiptScanRequest.TicketNumber);

        #region Get all blobs in the container which have been scanned
        var utcDateTime = DateTime.UtcNow.ToString("yyyy-MM-dd'T'HH:mm:ss", CultureInfo.InvariantCulture);
        var query = $@"""Malware Scanning scan time UTC"" <= '{utcDateTime}'";
        await foreach (var taggedBlobItem in blobContainerClient.FindBlobsByTagsAsync(query, cancellationToken))
        {
          var scanResult = response.ScanResults.FirstOrDefault(f => f.FileName.Equals(taggedBlobItem.BlobName));

          if (scanResult != null)
          {
            scanResult.IsScanned = true;
            scanResult.HasMalware = false;
            scanResult.Message = "Scanned!";

            foreach (var tag in taggedBlobItem.Tags)
            {
              scanResult.IndexTags.Add(tag.Key, tag.Value);
            }
          }
          else
          {
            var tagIndexes = new Dictionary<string, string>();
            foreach (var tag in taggedBlobItem.Tags)
            {
              tagIndexes.Add(tag.Key, tag.Value);
            }

            response.ScanResults = response.ScanResults.Append(new ScanResult()
            {
              FileName = taggedBlobItem.BlobName,
              IsScanned = true,
              HasMalware = false,
              Message = "Scanned!",
              IndexTags = tagIndexes
            });
          }
        }
        #endregion

        #region Get all blobs in the container which has virus
        query = $@"""Malware Scanning scan result"" = 'Malicious'";
        await foreach (var taggedBlobItem in blobContainerClient.FindBlobsByTagsAsync(query, cancellationToken))
        {
          var scanResult = response.ScanResults.FirstOrDefault(f => f.FileName.Equals(taggedBlobItem.BlobName));

          if (scanResult != null)
          {
            scanResult.IsScanned = true;
            scanResult.HasMalware = true;
            scanResult.Message = "Virus found!";

            foreach (var tag in taggedBlobItem.Tags)
            {
              scanResult.IndexTags.Add(tag.Key, tag.Value);
            }
          }
          else
          {
            var tagIndexes = new Dictionary<string, string>();
            foreach (var tag in taggedBlobItem.Tags)
            {
              tagIndexes.Add(tag.Key, tag.Value);
            }

            response.ScanResults = response.ScanResults.Append(new ScanResult()
            {
              FileName = taggedBlobItem.BlobName,
              IsScanned = true,
              HasMalware = true,
              Message = "Virus found!",
              IndexTags = tagIndexes
            });
          }
        }
        #endregion

        #region Get all blobs in the container which are clean
        query = $@"""Malware Scanning scan result"" = 'No threats found'";
        await foreach (var taggedBlobItem in blobContainerClient.FindBlobsByTagsAsync(query, cancellationToken))
        {
          var scanResult = response.ScanResults.FirstOrDefault(f => f.FileName.Equals(taggedBlobItem.BlobName));

          if (scanResult != null)
          {
            scanResult.IsScanned = true;
            scanResult.HasMalware = false;
            scanResult.Message = "No threats found!";

            foreach (var tag in taggedBlobItem.Tags)
            {
              scanResult.IndexTags.Add(tag.Key, tag.Value);
            }
          }
          else
          {
            var tagIndexes = new Dictionary<string, string>();
            foreach (var tag in taggedBlobItem.Tags)
            {
              tagIndexes.Add(tag.Key, tag.Value);
            }

            response.ScanResults = response.ScanResults.Append(new ScanResult()
            {
              FileName = taggedBlobItem.BlobName,
              IsScanned = true,
              HasMalware = false,
              Message = "No threats found!",
              IndexTags = tagIndexes
            });
          }
        }
        #endregion

        #region Filter the scan results based on the file name provided in the request
        if (!(string.IsNullOrEmpty(receiptScanRequest.FileName))) {
          response.ScanResults = response.ScanResults.Where(w => w.FileName.Equals(receiptScanRequest.FileName));
        }
        #endregion

        #region Delete all blobs in the container which have been scanned
        if (receiptScanRequest.DeleteFiles && response.ScanResults.Any(r => r.IsScanned))
        {
          var deleteRequest = new ReceiptDeleteRequest()
          {
            TicketNumber = receiptScanRequest.TicketNumber,
            FileNames = response.ScanResults.Where(w => w.IsScanned).Select(s => s.FileName).ToList()
          };

          var deleteResponse = await DeleteReceiptFileAsync(deleteRequest, cancellationToken);
        }
        #endregion
      }
      catch (System.Exception ex)
      {
        response.ScanResults = response.ScanResults.Append(new ScanResult()
        {
          FileName = null,
          IsScanned = false,
          Message = ex.Message,
          IndexTags = null
        });
      }
      
      return response;
    }

    private Tuple<int, string> GetBusinessRuleErrorDetails(string errorMessage)
    {
      var propertyName = string.IsNullOrEmpty(errorMessage) ? "" : errorMessage.Split(':')[0].Trim();

      if (!string.IsNullOrEmpty(propertyName)) 
      {
        propertyName = Regex.Replace(propertyName, @"-+", "").Trim();
      } 

      switch (propertyName)
      {
        case "SessionId":
          return new Tuple<int, string> (15_00_021, propertyName);
        case "TitleDynamicsId":
          return new Tuple<int, string>(15_00_022, propertyName);
        case "FirstName":
          return new Tuple<int, string>(15_00_023, propertyName);
        case "LastName":
          return new Tuple<int, string>(15_00_024, propertyName);
        case "AddressStreet":
          return new Tuple<int, string>(15_00_025, propertyName);
        case "City":
          return new Tuple<int, string>(15_00_026, propertyName);
        case "ProvinceState":
          return new Tuple<int, string>(15_00_027, propertyName);
        case "ZipCode":
          return new Tuple<int, string>(15_00_028, propertyName);
        case "CountryDynamicsId":
          return new Tuple<int, string>(15_00_029, propertyName);
        case "PrimaryPhone":
          return new Tuple<int, string>(15_00_030, propertyName);
        case "MobilePhone":
          return new Tuple<int, string>(15_00_031, propertyName);
        case "Email":
          return new Tuple<int, string>(15_00_032, propertyName);
        case "ConfirmEmail":
          return new Tuple<int, string>(15_00_033, propertyName);
        case "AeroPlanNumber":
          return new Tuple<int, string>(15_00_034, propertyName);
        case "ACStarAllianceTierDynamicsId":
          return new Tuple<int, string>(15_00_035, propertyName);
        case "FlightNumber":
          return new Tuple<int, string>(15_00_036, propertyName);
        case "FlightDate":
          return new Tuple<int, string>(15_00_037, propertyName);
        case "TicketNumber":
          return new Tuple<int, string>(15_00_038, propertyName);
        case "DepartureAirportCode":
          return new Tuple<int, string>(15_00_039, propertyName);
        case "ArrivalAirportCode":
          return new Tuple<int, string>(15_00_040, propertyName);
        case "PnrNumber":
          return new Tuple<int, string>(15_00_041, propertyName);
        case "Expenses":
          return new Tuple<int, string>(15_00_042, propertyName);
        case "ExpenseTypeDynamicsId":
          return new Tuple<int, string>(15_00_043, propertyName);
        case "CurrencyCode":
          return new Tuple<int, string>(15_00_044, propertyName);
        case "Amount":
          return new Tuple<int, string>(15_00_045, propertyName);
        case "Receipts":
          return new Tuple<int, string>(15_00_046, propertyName);
        case "FileName":
          return new Tuple<int, string>(15_00_047, propertyName);
        case "MimeType":
          return new Tuple<int, string>(15_00_048, propertyName);
        case "DocumentBody":
          return new Tuple<int, string>(15_00_049, propertyName);
        case "TransportationTypeDynamicsId":
          return new Tuple<int, string>(15_00_050, propertyName);
        case "MealTypeDynamicsId":
          return new Tuple<int, string>(15_00_051, propertyName);
        case "TransactionDate":
          return new Tuple<int, string>(15_00_052, propertyName);
        case "DisruptionCityAirportCode":
          return new Tuple<int, string>(15_00_053, propertyName);
        case "CheckInDate":
          return new Tuple<int, string>(15_00_054, propertyName);
        case "CheckOutDate":
          return new Tuple<int, string>(15_00_055, propertyName);
        default:
          return new Tuple<int, string>(BR_PassengerFlightDetails_Invalid, "Passenger and/or flight details");
      }
    }
  }
}
