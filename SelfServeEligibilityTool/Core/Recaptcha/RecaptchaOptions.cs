namespace ODE.SSET.Core.Recaptcha
{
  /// <summary>
  /// Configuration options for Recaptcha.
  /// </summary>
  public class RecaptchaOptions
  {
    /// <summary>
    /// Gets or sets the secret key to be used for verification.
    /// </summary>
    public string SecretKey { get; set; }

    /// <summary>
    /// Gets or sets the minimum acceptable Recaptcha score value.
    /// </summary>
    public decimal Threshold { get; set; }
  }
}
