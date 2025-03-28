﻿namespace ODE.SSET.Core.Domain.Dynamics
{
  using System;
  using System.Diagnostics;
  using System.Text.Json;
  using System.Text.Json.Serialization;

  public class JsonStringDateTimeConverter : JsonConverter<DateTime>
  {
    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
      Debug.Assert(typeToConvert == typeof(DateTime));
      return DateTime.Parse(reader.GetString() ?? string.Empty);
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
      writer.WriteStringValue(value.ToString());
    }
  }
}
