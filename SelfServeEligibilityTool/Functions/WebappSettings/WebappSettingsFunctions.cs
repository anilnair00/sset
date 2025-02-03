using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Options;

namespace ODE.SSET.Functions.WebappSettings
{
    public class WebappSettingsFunctions
    {
        private readonly IOptionsMonitor<WebappSettingsOptions> _optionsMonitor;

        public WebappSettingsFunctions(IOptionsMonitor<WebappSettingsOptions> optionsMonitor)
        {
            _optionsMonitor = optionsMonitor;
        }

        [FunctionName("WebappSettings")]
        public ActionResult<WebappSettingsModel> GetWebappSettings(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
        {
            var result = new WebappSettingsModel
            {
                IsInMaintenance = _optionsMonitor.CurrentValue.IsInMaintenance
            };

            return result;
        }
    }
}
