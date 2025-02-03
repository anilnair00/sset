namespace ODE.SSET.Interfaces
{
  using System.Collections.Generic;
  using System.Threading;
  using System.Threading.Tasks;
  using ODE.SSET.Interfaces.Dynamics;
  using ODE.SSET.Interfaces.MalwareScanning;

  public interface ISsetOperationsService
  {
    Task<IEnumerable<ILanguageModel>> GetLanguagesAsync(CancellationToken cancellationToken);
    Task<IEnumerable<ITitleModel>> GetTitlesAsync(string languageCode, CancellationToken cancellationToken);
    Task<IEnumerable<ICountryModel>> GetCountriesAsync(string languageCode, CancellationToken cancellationToken);
    Task<IEnumerable<IAirportModel>> GetAirportsAsync(string languageCode, IEnumerable<string> airportCodes, CancellationToken cancellationToken);
    Task<IEnumerable<IStarAllianceTierModel>> GetStarAllianceTiersAsync(string languageCode, CancellationToken cancellationToken);
    Task<IEnumerable<IProvinceModel>> GetProvincesAsync(string languageCode, string countryCode, CancellationToken cancellationToken);
    Task<IEnumerable<IRelationshipModel>> GetRelationshipsAsync(string languageCode, CancellationToken cancellationToken);
    Task<IEnumerable<IExpenseTypeModel>> GetExpenseTypesAsync(string languageCode, CancellationToken cancellationToken);
    Task<IEnumerable<ICurrencyModel>> GetCurrenciesAsync(string languageCode, CancellationToken cancellationToken);
    Task<IEnumerable<IMealTypeModel>> GetMealTypesAsync(string languageCode, CancellationToken cancellationToken);
    Task<ISsetResponse> ValidateRecaptcha(ISsetRequest ssetRequest, CancellationToken cancellationToken);
    Task<ISsetResponse> CreateDynamicsWebRequest(ISsetRequest ssetRequest, CancellationToken cancellation);
    Task<IEnumerable<IRegimeModel>> GetRegimesAsync(CancellationToken cancellationToken);
    Task<IEnumerable<IOverrideOptionModel>> GetOverrideOptionsAsync(CancellationToken cancellationToken);
    Task<IEnumerable<ITransportationTypeModel>> GetTransportationTypesAsync(string languageCode, CancellationToken cancellationToken);
    Task<IReceiptUploadResponse> UploadReceiptFileAsync(IReceiptUploadRequest receiptRequest, CancellationToken cancellationToken);
    Task<IEnumerable<IReceiptDeleteResponse>> DeleteReceiptFileAsync(IReceiptDeleteRequest receiptDeleteRequest, CancellationToken cancellationToken);
    Task<IReceiptScanResponse> GetReceiptScanResponseAsync(IReceiptScanRequest receiptScanRequest, CancellationToken cancellationToken);
  }
}
