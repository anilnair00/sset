namespace ODE.SSET.Interfaces
{
  public interface ILanguageModel
  {
    public int Id { get; set; }

    public string Code { get; set; }

    public string Description { get; set; }

    public long DynamicsId { get; set; }
  }
}
