﻿namespace ODE.SSET.Interfaces
{
  public interface IRelationshipModel
  {
    public int Id { get; set; }

    public string Description { get; set; }

    public long DynamicsId { get; set; }

    public string LanguageCode { get; set; }
  }
}
