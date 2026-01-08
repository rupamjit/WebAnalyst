(function () {
  const script = document.currentScript;
  const websiteId = script.getAttribute("data-website-id");
  const domain = script.getAttribute("data-domain");

  if (!websiteId || !domain) {
    console.error("Analytics: Missing websiteId or domain");
    return;
  }

  const API_URL = "http://localhost:3000/api/track";

  // Extract UTM parameters from URL
  const getUTMParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get("utm_source") || null,
      utm_medium: urlParams.get("utm_medium") || null,
      utm_campaign: urlParams.get("utm_campaign") || null,
      utm_term: urlParams.get("utm_term") || null,
      utm_content: urlParams.get("utm_content") || null,
    };
  };

  // Send entry tracking data
  const sendEntry = async () => {
    const entryData = {
      type: "entry",
      websiteId,
      domain,
      entryTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || "direct",
      url: window.location.href,
      language: navigator.language,
      ...getUTMParams(),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entryData),
      });
      
      const result = await response.json();
      
      // Store the pageViewId for exit tracking
      if (result.pageViewId) {
        sessionStorage.setItem('analytics_pageViewId', result.pageViewId);
      }
    } catch (err) {
      console.error("Analytics entry error:", err);
    }
  };

  // Send entry data immediately
  sendEntry();

  // Track active time
  let entryTime = Date.now();
  let totalActiveTime = 0;

  const sendExit = () => {
    totalActiveTime += Date.now() - entryTime;
    
    const pageViewId = sessionStorage.getItem('analytics_pageViewId');

    const exitData = {
      type: "exit",
      pageViewId,
      websiteId,
      domain,
      activeTime: totalActiveTime,
      exitTime: new Date().toISOString(),
    };

    // Use sendBeacon for more reliable exit tracking
    if (navigator.sendBeacon) {
      navigator.sendBeacon(API_URL, JSON.stringify(exitData));
    } else {
      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exitData),
        keepalive: true,
      }).catch((err) => console.error("Analytics exit error:", err));
    }
    
    // Clean up
    sessionStorage.removeItem('analytics_pageViewId');
  };

  // Track page visibility for better active time tracking
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      totalActiveTime += Date.now() - entryTime;
    } else {
      entryTime = Date.now();
    }
  });

  window.addEventListener("beforeunload", sendExit);
  window.addEventListener("pagehide", sendExit);
})();
