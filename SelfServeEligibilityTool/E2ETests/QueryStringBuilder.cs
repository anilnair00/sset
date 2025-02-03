using System;
using System.Collections.Specialized;
using System.Globalization;
using System.Linq;
using System.Net;

namespace ODE.SSET.E2ETests
{
  /// <summary>
  /// Helper class to build query strings for HttpClient.
  /// </summary>
  /// <example>
  /// QueryStringBuilder
  ///     .For("clients")
  ///     .AddParam("name", "toto")
  ///     .ToString(); -> clients?name=toto
  /// </example>
  public class QueryStringBuilder
  {
    private readonly string _path;
    private readonly NameValueCollection _parameters = new NameValueCollection();

    private QueryStringBuilder(string path)
    {
      _path = path ?? throw new ArgumentNullException(nameof(path));
    }

    /// <summary>
    /// Implicit conversion to string.
    /// </summary>
    public static implicit operator string(QueryStringBuilder queryStringBuilder)
    {
      return queryStringBuilder?.ToString();
    }

    /// <summary>
    /// Creates a new instance of <see cref="QueryStringBuilder"/> using
    /// <paramref name="path"/> as the base path.
    /// </summary>
    public static QueryStringBuilder For(string path)
    {
      return new QueryStringBuilder(path);
    }

    /// <summary>
    /// Adds a query string parameter.
    /// </summary>
    /// <param name="name">The name of the parameter</param>
    /// <param name="value">The value of the parameter</param>
    /// <param name="encode">True to UrlEncode the value, false otherwise.</param>
    public QueryStringBuilder AddParam(string name, string value, bool encode = true)
    {
      if (string.IsNullOrEmpty(name))
      {
        throw new ArgumentNullException(nameof(name));
      }

      if (string.IsNullOrEmpty(value))
      {
        return this;
      }

      _parameters.Add(name, encode ? WebUtility.UrlEncode(value) : value);
      return this;
    }

    /// <summary>
    /// Adds a query string parameter.
    /// </summary>
    /// <param name="name">The name of the parameter</param>
    /// <param name="value">The value of the parameter</param>
    /// <param name="encode">True to UrlEncode the value, false otherwise.</param>
    public QueryStringBuilder AddParam(string name, object value, bool encode = true)
    {
      if (value == null)
      {
        return this;
      }

      return AddParam(name, value.ToString(), encode);
    }

    /// <summary>
    /// Returns the complete query string.
    /// </summary>
    public override string ToString()
    {
      if (_parameters.Count == 0)
      {
        return _path;
      }

      return string.Format(
          CultureInfo.InvariantCulture,
          "{0}?{1}",
          _path,
          string.Join(
              "&",
              _parameters
                  .AllKeys
                  .SelectMany(key =>
                      _parameters
                          .GetValues(key)
                          .Select(value => string.Format(CultureInfo.InvariantCulture, "{0}={1}", key, value))
                          .ToArray())));
    }
  }
}
