using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Web.Http;
using System.Web.Script.Serialization;
using System.Web.Script.Services;

namespace Covid19Api.Controllers
{
    public class CovidController : ApiController
    {
        [HttpGet]
        [Route("api/GetMaxCovidOcurencies/{maxNumber}")]
        public IHttpActionResult GetMaxCovidOcurencies(int maxNumber)
        {
            string url = "https://api.covid19api.com/summary";		
            WebRequest request = System.Net.WebRequest.Create(url);
            request.Credentials = CredentialCache.DefaultCredentials;
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Console.WriteLine(response.StatusDescription);
            Stream dataStream = response.GetResponseStream();
            StreamReader reader = new StreamReader(dataStream);
            string responseFromServer = reader.ReadToEnd();
            var obj = new JavaScriptSerializer().DeserializeObject(responseFromServer) as Dictionary<string,object>;
            var Global = obj["Global"] as Dictionary<string, object>;
            int total = (int)Global["TotalConfirmed"];
            reader.Close();
            dataStream.Close();
            response.Close();
            if (maxNumber > total)
            {
                return Ok("Number of cases inserted is greater than the total confirmed cases worldwide");
            }
            else
            {
                return Ok("Number of cases inserted is lesser than the total confirmed cases worldwide");
            }
        }
    }
}
