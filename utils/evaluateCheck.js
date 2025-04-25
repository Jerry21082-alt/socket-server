function evaluateCheck(checkName, data) {
  switch (checkName) {
    // ───── On-Page SEO Results ─────
    case "Title Tag":
      return data.title && data.title.trim().length > 0;

    case "Target Keyword in Title Tag":
      return (
        data.keyword &&
        data.title &&
        data.title.toLowerCase().includes(data.keyword.toLowerCase())
      );

    case "Meta Description Tag":
      return data.metaDescription && data.metaDescription.trim().length > 0;

    case "Target Keyword in Meta Description Tag":
      return (
        data.keyword &&
        data.metaDescription &&
        data.metaDescription.toLowerCase().includes(data.keyword.toLowerCase())
      );

    case "SERP Snippet Preview":
      return data.title && data.metaDescription;

    case "Hreflang Tag":
      return data.hreflang === true;

    case "Lang attribute in Header Tag":
      return data.langAttr && data.langAttr.trim().length > 0;

    case "H1 Header Tag Usage":
      return data.h1 && data.h1.trim().length > 0;

    case "Target Keyword in H1":
      return (
        data.keyword &&
        data.h1 &&
        data.h1.toLowerCase().includes(data.keyword.toLowerCase())
      );

    case "H2-H6 Header Tag Usage":
      return typeof data.h2toh6Count === "number" && data.h2toh6Count > 0;

    case "Keyword Consistency":
      return (
        data.keyword &&
        data.keywordUsage &&
        data.keywordUsage.toLowerCase().includes(data.keyword.toLowerCase())
      );

    case "Amount of Content":
      return data.keywordUsage && data.keywordUsage.length > 500;

    case "Image Alt Attributes":
      return typeof data.imagesWithAlt === "number" && data.imagesWithAlt > 0;

    case "Target Keyword in Image Alt Attributes":
      return (
        data.keyword &&
        data.imagesAltText &&
        data.imagesAltText.toLowerCase().includes(data.keyword.toLowerCase())
      );

    case "Canonical Tag":
      return data.hasCanonical === true;

    case "Noindex Tag Test":
      return (
        data.metaRobotsTag &&
        !data.metaRobotsTag.toLowerCase().includes("noindex")
      );

    case "Noindex Header Test":
      return data.noindexHeader !== true;

    case "SSL Enabled":
      return data.hasSSL === true;

    case "XML Sitemaps":
      return data.hasXMLSitemap === true;

    case "Analytics":
      return data.hasAnalytics === true;

    case "Robots.txt":
      return data.hasRobotsTxt === true;

    case "Blocked by Robots.txt":
      return data.isBlockedByRobots !== true;

    // ───── Local SEO ─────
    case "Address & Phone Shown on Website":
      return data.hasAddress && data.hasPhone;

    case "Local Business Schema":
      return data.hasLocalBusinessSchema === true;

    case "Google Business Profile Identified":
      return data.hasGoogleBusinessProfile === true;

    case "Google Business Profile Completeness":
      return data.googleBusinessProfileCompleteness >= 80;

    case "Google Reviews":
      return (
        typeof data.googleReviewsCount === "number" &&
        data.googleReviewsCount > 0
      );

    case "Technology List":
      return Array.isArray(data.technologies) && data.technologies.length > 0;

    case "Server IP Address":
      return data.serverIp && data.serverIp.trim().length > 0;

    case "DNS Servers":
      return Array.isArray(data.dnsServers) && data.dnsServers.length > 0;

    case "Web server":
      return data.webServer && data.webServer.trim().length > 0;

    case "Charset":
      return data.charset && data.charset.trim().length > 0;

    case "DMARC Record":
      return data.hasDMARC === true;

    case "SPF Record":
      return data.hasSPF === true;

    case "Top Keyword Rankings":
      return Array.isArray(data.topKeywords) && data.topKeywords.length > 0;

    case "Total Traffic From Search":
      return typeof data.searchTraffic === "number" && data.searchTraffic > 0;

    case "Keyword Positions":
      return (
        Array.isArray(data.keywordPositions) && data.keywordPositions.length > 0
      );
    case "Backlink Summary":
      return data.backlinksCount > 0;

    case "Top Backlinks":
      return Array.isArray(data.topBacklinks) && data.topBacklinks.length > 0;

    case "Top Pages by Backlinks":
      return (
        Array.isArray(data.topPagesByBacklinks) &&
        data.topPagesByBacklinks.length > 0
      );

    case "Top Anchors by Backlinks":
      return Array.isArray(data.topAnchors) && data.topAnchors.length > 0;

    case "Top Geographies":
      return Array.isArray(data.backlinkGeos) && data.backlinkGeos.length > 0;

    case "On-Page Links":
      return typeof data.totalLinks === "number" && data.totalLinks > 0;

    case "Friendly Links":
      return typeof data.friendlyLinks === "number" && data.friendlyLinks > 0;

    case "Target Keyword in URL":
      return (
        data.keyword &&
        data.url &&
        data.url.toLowerCase().includes(data.keyword.toLowerCase())
      );

    case "Device Rendering":
      return data.deviceRendering === "responsive";

    case "Use of Mobile Viewports":
      return data.hasMobileViewport === true;

    case "Google's Core Web Vitals":
      return data.coreWebVitalsPassed === true;

    case "Page Speed Insights - Mobile":
      return data.pageSpeedMobileScore >= 60;

    case "Page Speed Insights - Desktop":
      return data.pageSpeedDesktopScore >= 60;

    case "Flash Used?":
      return data.flashUsed === false;

    case "iFrames Used?":
      return data.iFramesUsed === false;

    case "Favicon":
      return data.hasFavicon === true;

    case "Email Privacy":
      return data.hasObfuscatedEmail === true;

    case "Legible Font Sizes":
      return data.fontSizeLegible === true;

    case "Top Target Sizing":
      return data.targetsProperlySized === true;

    case "Page Speed":
      return data.pageSpeedScore >= 60;

    case "Download Page Size":
      return data.pageSizeKB <= 2000;

    case "Website Compression (Gzip, Deflate, Brotli)":
      return data.compressionEnabled === true;

    case "Number of Objects Loaded":
      return data.objectsCount < 100;

    case "Google Accelerated Mobile Pages (AMP)":
      return data.hasAMP === true;

    case "Javasctipt Errors":
      return data.javascriptErrors === 0;

    case "HTTP2 Usage":
      return data.usesHttp2 === true;

    case "Image Optimization":
      return data.imagesOptimized === true;

    case "Minification":
      return data.codeMinified === true;

    case "Deprecated HTML":
      return data.deprecatedHtmlUsed === false;

    case "Inline Styles":
      return data.inlineStylesUsed === false;

    case "Facebook Page Linked":
      return !!data.facebookPage;

    case "X (Formerly Twitter) Account Linked":
      return !!data.twitterAccount;

    case "X Cards":
      return data.hasTwitterCards === true;

    case "Instagram Linked":
      return !!data.instagramProfile;

    case "Youtube Channel Linked":
      return !!data.youtubeChannel;

    case "Youtube Channel Activity":
      return data.youtubeActivityRecent === true;

    case "LinkedIn Page Linked":
      return !!data.linkedinPage;

    default:
      return null; // Unknown check
  }
}

module.exports = { evaluateCheck };
