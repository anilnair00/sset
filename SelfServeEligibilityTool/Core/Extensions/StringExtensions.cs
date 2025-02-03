using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace ODE.SSET.Core.Extensions
{
  public static class StringExtensions
  {
    /// <summary>
    /// Remove accents from words.
    /// </summary>
    /// <param name="value">A string value that may contain accents.</param>
    /// <returns>Return a string stripped of accents.</returns>
    public static string RemoveDiacritics(this string value)
    {
      if (string.IsNullOrWhiteSpace(value))
      {
        return value;
      }

      return string.Concat(value
              .Trim()
              .Normalize(NormalizationForm.FormD)
              .Where(ch => CharUnicodeInfo.GetUnicodeCategory(ch) != UnicodeCategory.NonSpacingMark))
          .Normalize(NormalizationForm.FormC);
    }

    public static string RemoveNonAlphaNumericCharacters(this string value)
    {
      if (string.IsNullOrWhiteSpace(value))
      {
        return value;
      }

      return new Regex("[^\\p{L}\\p{N}]").Replace(value.Trim(), string.Empty);
    }
  }
}
