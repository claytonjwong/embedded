(function () {
  // Localize jQuery variable
  var jQuery;

  /******** Load jQuery if not present *********/
  if (window.jQuery === undefined || window.jQuery.fn.jquery !== "3.2.1") {
    const scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js");
    if (scriptTag.readyState) {
      scriptTag.onreadystatechange = function () { // For old versions of IE
        if (this.readyState === "complete" || this.readyState === "loaded") {
          scriptLoadHandler();
        }
      };
    } else {
      scriptTag.onload = scriptLoadHandler;
    }
    // Try to find the head, otherwise default to the documentElement
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(scriptTag);
    const canvasScript = document.createElement("script");
    canvasScript.setAttribute("type", "text/javascript");
    canvasScript.setAttribute("src", "https://cdn.jsdelivr.net/npm/fingerprintjs2@1.8.0/dist/fingerprint2.min.js");
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(canvasScript);
  } else {
    jQuery = window.jQuery;// The jQuery version on the window is the one we want to use
    main();
  }

  
  function scriptLoadHandler() {
    /******** Called once jQuery has loaded ******/
    // Restore $ and window.jQuery to their previous values and store the new jQuery in our local jQuery variable
    jQuery = window.jQuery.noConflict(true);
    main();
  }

  /******** Our main function ********/
  function main() {
    jQuery(document).ready(function($) {
      var key, widgetId, environment, label, value, category, user, amount, sessionLength = 15;
      const customParam = []; //holds custom params
      const elem = document.getElementById("abbot-script");

      for (let i = 0; i < elem.attributes.length; i++) {
        const attrib = elem.attributes[i];
        if (attrib.specified && attrib.name.indexOf("data-") !== -1) {
          if (attrib.name === "data-env")
            environment = attrib.value;
          else if (attrib.name === "data-wid")
            widgetId = attrib.value;
          else if (attrib.name === "data-key")
            key = attrib.value;
          else if (attrib.name === "data-label")
            label = attrib.value;
          else if (attrib.name === "data-value")
            value = attrib.value;
          else if (attrib.name === "data-category")
            category = attrib.value;
          else if (attrib.name === "data-user")
            user = attrib.value;
          else if (attrib.name === "data-amount")
            amount = attrib.value;
          else if (attrib.name === "data-session") {
            var minutes = parseInt(attrib.value);
            if (minutes !== null && !isNaN(minutes)) {
              sessionLength = minutes;
            }
          }
          else
            customParam.push({ Name: attrib.name.replace("data-", "").replace("_", " "), Value: attrib.value });
        }
      }
     
      if (environment === null || environment === undefined || key === null || widgetId === null) {
        //bad setup, missing a required param, maybe log an error here?
        console.log("Your setup is missing a required parameter.");
        return false;
      }

      var host = "https://" + environment; //localhost
      if (environment === "prod") {
        host = "https://mapixl.com";
      } else if (environment === "qa") {
        host = "https://qa.mapixl.com";
      } else if (environment === "dev") {
        host = "https://localhost:44317";
      }

      var customEventParam = {
        label: label,
        value: value,
        category: category,
        user: user,
        amount: amount
      };

      //**get querystring values**
      const utmData = {
        utmSource: getParameterByName('utm_source'),
        utmMedium: getParameterByName('utm_medium'),
        utmCampaign: getParameterByName('utm_campaign'),
        utmTerm: getParameterByName('utm_term'),
        utmContent: getParameterByName('utm_content'),
        isGoogleAd: (getParameterByName('gclid') ? true : false),
        refererUrl: document.referrer
      };


      //**get canvas data and then make call once data is returned **
      new window.Fingerprint2().get(function (result, components) {
        const canvasData = processFingerprint(result, components);

        var isSessionStart = true;
        const maCookie = getCookie("maId");
        if (maCookie !== null) {
          setCookie("maId", maCookie, addMinutes(new Date(), sessionLength)); //extend the expiration
          isSessionStart = false;
        } else {
          setCookie("maId", JSON.stringify({ cid: canvasData.canvasId, sid: createGuid3() }), addMinutes(new Date(), sessionLength)); //set initial cookie
        }

        const customData = {
          jsonCustomParmeters: JSON.stringify(customParam),
          utmValues: JSON.stringify(utmData),
          canvasValues: JSON.stringify(canvasData),
          eventParameters: JSON.stringify(customEventParam),
          isSessionStart: isSessionStart,
          maCookie: getCookie("maId"),
          isPageLoad: true
        };

        


        /******* Load HTML or make impression call *******/
        //console.log("sent request with isPageLoad:true canvasId:" + canvasData.canvasId);

        const url = host + "/widget/getwidget/" + key + "/" + widgetId + "/" + encodeURIComponent(environment.replace(":", "|")) +
          "?originUrl=" + encodeURIComponent(document.location.href) + "&callback=?";
        jQuery.ajax({
          url: url,
          type: "post",
          contentType: "application/x-www-form-urlencoded",
          data: customData,
          cache: false,
          dataType: "json",
          jsonp: false,
          success: function (data) { //successfully loaded html form 
            if (data.canvasId.length > 0) {
              //console.log(data.canvasId);
            }
          },
          error: function (xhr) {
            //console.log("error with call: " + xhr);
          }
        });
      });

      //const cssLink = $("<link>",
      //  {
      //    rel: "stylesheet",
      //    type: "text/css",
      //    href: host + "/content/widgetcss/widget.css?sddd2dd22adsa6"
      //  });
      //cssLink.appendTo("head");
      return false;
    });
  }
}) (); // We call our anonymous function immediately

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function processFingerprint(result, components) {
  var canvasResult = {
    canvasId: result,
    adblock: null,
    timezoneOffset: 0,
    touchPoints: 0,
    touchEvent: null,
    touchStart: null,
    platform: "unknown",
    resolution: "unknown"
  };
  for (window.i in components) {
    if (components.hasOwnProperty(window.i)) {
      const value = components[window.i].value;
      switch (components[window.i].key) {
      case "adblock":
        canvasResult.adblock = value;
        break;
      case "timezone_offset":
        canvasResult.timezoneOffset = (value / 60) * -1;
        break;
      case "touch_support":
        canvasResult.touchPoints = value[0];
        canvasResult.touchEvent = value[1];
        canvasResult.touchStart = value[2];
        break;
      case "navigator_platform":
        if (canvasResult.platform === "unknown") {
          canvasResult.platform = value;
        }
        break;
      case "user_agent":
        if (value.indexOf("WOW64") !== -1 || value.indexOf("Win64") !== -1) {
          canvasResult.platform = "Win64";
        }
        break;
      case "resolution":
        canvasResult.resolution = value[0] + "x" + value[1];
        break;
      }
    }
  }
  return canvasResult;
}

function setCookie(name, value, expirationDate) {
  var expires = "; expires=" + expirationDate.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
  var nameEq = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEq) === 0) return c.substring(nameEq.length, c.length);
  }
  return null;
}
function eraseCookie(name) {
  document.cookie = name + '=; Max-Age=-99999999;';
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

function createGuid3() {
  var d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}