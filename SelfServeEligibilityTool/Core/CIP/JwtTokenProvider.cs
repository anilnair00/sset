using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace ODE.SSET.Core.CIP
{
  public class JwtTokenProvider
  {
    public JwtTokenProvider()
    {

    }

    public bool IsValid(JwtSecurityToken token)
    {
      if (token == null)
      {
        return false;
      }

      var expirationDateTime = token.ValidTo;
      return expirationDateTime != null && DateTime.UtcNow < expirationDateTime;
    }

  }
}
