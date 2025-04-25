const seoSuggestions = {
  "On-Page SEO Results": {
    "Title Tag":
      "Ensure your title tag is unique, under 60 characters, and includes your primary keyword near the beginning to improve click-through rates and search visibility.",
    "Target Keyword in Title Tag":
      "Incorporate your target keyword in the title tag naturally, ideally at the start, to signal relevance to search engines.",
    "Meta Description Tag":
      "Write a compelling meta description (up to 155 characters) that summarizes the page content and includes a call-to-action to improve CTR.",
    "Target Keyword in Meta Description Tag":
      "Include the target keyword once in the meta description to improve snippet relevance, but avoid keyword stuffing.",
    "SERP Snippet Preview":
      "Preview and refine how your page appears in Google search results, focusing on persuasive copy in the title and meta description.",
    "Hreflang Tag":
      "Use hreflang tags to indicate language and regional targeting for multilingual sites, helping search engines serve the correct version to users.",
    "Lang attribute in Header Tag":
      "Add a `lang` attribute (e.g., `<html lang='en'>`) to help browsers and search engines understand your page's language.",
    "H1 Header Tag Usage":
      "Use a single, descriptive `<h1>` tag per page that summarizes the main topic to guide both users and search engines.",
    "Target Keyword in H1":
      "Include your main keyword in the `<h1>` heading to reinforce page relevance and improve rankings.",
    "H2-H6 Header Tag Usage":
      "Organize your content with a clear heading structure (H2-H6) to improve readability, accessibility, and SEO context.",
    "Keyword Consistency":
      "Use your primary and secondary keywords consistently throughout headings, paragraphs, and metadata to maintain topic focus.",
    "Amount of Content":
      "Expand your content with valuable, well-structured information—aim for at least 600-1000 words depending on topic competition.",
    "Image Alt Attributes":
      "Add descriptive and relevant alt text to every image to enhance accessibility and help search engines understand visual content.",
    "Target Keyword in Image Alt Attributes":
      "Naturally include relevant keywords in image alt text where appropriate to boost contextual relevance.",
    "Canonical Tag":
      "Add a canonical tag to each page to define the preferred URL and prevent duplicate content issues across your site.",
    "Noindex Tag Test":
      "Only apply `noindex` to pages like admin dashboards or thank-you pages—ensure important content is not excluded from indexing.",
    "Noindex Header Test":
      "Avoid conflicts between meta and HTTP header `noindex` tags to ensure clear indexing instructions.",
    "SSL Enabled":
      "Secure your website with HTTPS to protect user data and benefit from Google's ranking boost for secure sites.",
    "XML Sitemaps":
      "Generate and submit an XML sitemap to help search engines discover and index all relevant pages efficiently.",
    Analytics:
      "Integrate tools like Google Analytics or Plausible to track user behavior and site performance metrics for data-driven decisions.",
    "Robots.txt":
      "Review your `robots.txt` file to ensure it's allowing key pages to be crawled while blocking non-essential or duplicate content.",
    "Blocked by Robots.txt":
      "Audit your robots.txt rules to ensure important pages like your homepage or blog are not being blocked from crawlers.",
  },
  "Local SEO Results": {
    "Local Business Schema":
      "Add structured data using LocalBusiness schema to help search engines understand your business name, address, hours, and contact info for better local visibility.",
    "Business Address in Footer":
      "Display your full, consistent business address in the footer to reinforce local relevance and support NAP consistency across your site.",
    "NAP (Name, Address, Phone) Consistency":
      "Ensure your business name, address, and phone number are identical across your website and online listings to boost trust and local SEO performance.",
    "Google Maps Embed":
      "Embed a Google Map with your business location to improve user trust and local search signals.",
    "Google Business Profile Link":
      "Link to your verified Google Business Profile to strengthen your authority and drive more local traffic.",
    "Local Keyword Targeting":
      "Include city or region-specific keywords (e.g., 'plumber in Austin') in titles, headers, and body content to rank higher for local queries.",
    "Local Reviews Schema":
      "Add structured review data to display star ratings in search results, which can increase credibility and click-through rates.",
    "Local Landing Page Optimization":
      "Create dedicated landing pages for each location you serve, optimized with local keywords and tailored contact details.",
    "Citations and Directories":
      "List your business on trusted local directories (like Yelp, BBB, and Yellow Pages) with accurate, consistent NAP info for local ranking improvements.",
  },
  "Technology Results": {
    "Technology List":
      "List and verify the core technologies (CMS, frameworks, plugins) used on your site. Ensure they are up-to-date, secure, and compatible with SEO best practices.",
    "Server IP Address":
      "Check that your server’s IP address is not blacklisted and is geographically appropriate for your target audience to improve load times and trust.",
    "DNS Servers":
      "Use high-performance and secure DNS providers like Cloudflare or Google DNS to ensure fast and reliable domain resolution.",
    "Web server":
      "Ensure your web server software (e.g., Nginx, Apache) is fully patched, supports HTTPS, and is optimized for performance and scalability.",
    Charset:
      "Set the character encoding (e.g., UTF-8) in the <head> to ensure proper text rendering and avoid indexing issues for international content.",
    "DMARC Record":
      "Add a DMARC DNS record to protect your domain from phishing attacks and improve email deliverability and trust signals.",
    "SPF Record":
      "Use an SPF DNS record to authorize which email servers can send on behalf of your domain, helping reduce spam and improve domain credibility.",
  },
  "Keyword Rankings": {
    "Top Keyword Rankings":
      "Monitor and prioritize high-performing keywords to maintain rankings and identify opportunities to create supporting content or pillar pages.",
    "Total Traffic From Search":
      "Track organic search traffic trends using analytics tools to assess SEO performance and identify seasonal shifts or algorithm impacts.",
    "Keyword Positions":
      "Audit your current keyword positions regularly. Improve page optimization, internal linking, and backlink strategies to boost rankings for underperforming keywords.",
  },
  Links: {
    "Backlink Summary":
      "Conduct a regular backlink audit to ensure quality over quantity. Focus on earning backlinks from high-authority and relevant domains.",
    "Top Backlinks":
      "Identify your most valuable backlinks and maintain relationships with those sources. Aim to replicate similar links on other authoritative sites.",
    "Top Pages by Backlinks":
      "Optimize and update your most linked pages to keep them relevant and high-converting, as they carry significant SEO value.",
    "Top Anchors by Backlinks":
      "Ensure anchor text diversity across backlinks to avoid over-optimization and improve the natural appearance of your link profile.",
    "Top Geographies":
      "Build backlinks from sites within your target audience’s region to strengthen local SEO signals and increase relevance in local searches.",
    "On-Page Links":
      "Use descriptive and relevant anchor text for internal links, and ensure a logical internal linking structure to guide both users and search engines.",
    "Friendly Links":
      "Use clean, keyword-rich URLs that are short, human-readable, and structured for clarity (e.g., /services/seo instead of /page?id=123).",
    "Target Keyword in URL":
      "Incorporate target keywords into URLs where it feels natural to reinforce relevance and improve click-through rates on search listings.",
  },
  "Usability Results": {
    "Device Rendering":
      "Ensure your website is responsive and renders properly on various devices (desktops, tablets, smartphones). Regularly test across common screen sizes to ensure compatibility.",
    "Use of Mobile Viewports":
      "Implement a responsive viewport meta tag (e.g., <meta name='viewport' content='width=device-width, initial-scale=1'>) to optimize mobile usability.",
    "Google's Core Web Vitals":
      "Focus on improving Core Web Vitals metrics like LCP (Largest Contentful Paint), FID (First Input Delay), and CLS (Cumulative Layout Shift) to enhance user experience and rankings.",
    "Page Speed Insights - Mobile":
      "Leverage Google's PageSpeed Insights tool to identify mobile performance bottlenecks. Optimize images, reduce JavaScript, and implement lazy loading to improve load time.",
    "Page Speed Insights - Desktop":
      "Minimize render-blocking resources, compress assets, and defer non-critical JavaScript to boost desktop performance and enhance user engagement.",
    "Flash Used?":
      "Avoid using Flash as it is deprecated and unsupported by modern browsers. Replace it with HTML5, CSS3, or JavaScript alternatives.",
    "iFrames Used?":
      "Limit the use of iframes unless necessary for embedding external content. Excessive iframe use can slow down your page and negatively affect SEO.",
    Favicon:
      "Add a recognizable and properly sized favicon (16x16 or 32x32) to enhance brand identity and user trust. It also improves visibility in browser tabs and bookmarks.",
    "Email Privacy":
      "Protect email addresses by using obfuscation techniques or forms to prevent email scraping by spammers, ensuring your contact information remains private.",
    "Legible Font Sizes":
      "Ensure your text is easily readable on all devices by using legible font sizes (minimum 16px) and providing proper contrast against the background.",
    "Top Target Sizing":
      "Optimize clickable elements (e.g., buttons, links) for touch interaction by making them large enough (45x45 pixels) for a better mobile user experience.",
  },
  "Performance Results": {
    "Page Speed":
      "Improve site speed by optimizing images (use WebP or AVIF formats), reducing unused CSS and JavaScript, and leveraging browser caching. Consider implementing a content delivery network (CDN) to serve assets from geographically closer locations.",
    "Download Page Size":
      "Keep the total page size under 2MB for faster loading times. Compress images, use lazy loading, and minify your code to reduce the overall file size.",
    "Website Compression (Gzip, Deflate, Brotli)":
      "Enable Gzip or Brotli compression for all text-based resources (HTML, CSS, JavaScript) to reduce file sizes and enhance load speed.",
    "Number of Objects Loaded":
      "Reduce the number of requests made during page load by combining CSS and JavaScript files, using image sprites, and deferring non-essential content.",
    "Google Accelerated Mobile Pages (AMP)":
      "Consider implementing AMP (Accelerated Mobile Pages) for content-heavy pages (e.g., news articles, blogs) to deliver ultra-fast mobile experiences.",
    "Javascript Errors":
      "Fix JavaScript errors by reviewing the browser console for issues. Uncaught errors can disrupt functionality and negatively affect user experience and SEO.",
    "HTTP2 Usage":
      "Ensure your server supports HTTP/2 to enable multiplexed requests, resulting in faster loading times for users by reducing the number of round trips required for resource fetching.",
    "Image Optimization":
      "Optimize images by reducing file sizes using lossless compression techniques or modern formats like WebP, and consider responsive image attributes to serve different image sizes based on device screen resolution.",
    Minification:
      "Minify CSS, JavaScript, and HTML files to remove unnecessary whitespace, comments, and characters. This reduces file size and speeds up page rendering.",
    "Deprecated HTML":
      "Avoid using outdated or deprecated HTML tags (such as <font> and <center>) to ensure your code is semantically correct and optimized for modern browsers.",
    "Inline Styles":
      "Move inline styles to external CSS files for better performance and maintainability. This reduces page size and allows for more efficient caching and reusability.",
  },
  "Social Results": {
    "Facebook Page Linked":
      "Link your business Facebook page to your website to boost visibility and engagement. Ensure your page is active with regular posts, user interactions, and up-to-date business information to enhance trust and authority.",
    "X (Formerly Twitter) Account Linked":
      "Link your X (formerly Twitter) account to your website to build brand trust and engage with your audience. Regularly tweet valuable content and participate in trending discussions to increase your reach and authority.",
    "X Cards":
      "Implement X Card metadata to enhance the preview of your content when shared on X. Use rich media, such as images, video, and concise descriptions to make your posts more engaging and shareable.",
    "Instagram Linked":
      "Add your Instagram link to your site to connect with your visual audience. Regularly post high-quality images or videos to build engagement and promote your products or services creatively.",
    "YouTube Channel Linked":
      "Link your YouTube channel to your site to showcase your video content. Ensure your videos are optimized for SEO with descriptive titles, tags, and compelling thumbnails. Post regularly and engage with your viewers through comments.",
    "YouTube Channel Activity":
      "Stay active on YouTube by uploading consistent content that aligns with your brand's message. Engage with your audience in the comments section, and optimize video titles, descriptions, and tags for better discoverability.",
    "LinkedIn Page Linked":
      "Include a link to your LinkedIn business page for improved credibility in the B2B sector. Regularly share relevant industry insights, business updates, and case studies to engage with professionals and grow your network.",
  },
};

function getSuggestion(category, check) {
  // Check if the category exists in seoSuggestions
  if (seoSuggestions[category]) {
    // Check if the specific check exists within that category
    if (seoSuggestions[category][check]) {
      return seoSuggestions[category][check];
    } else {
      // Return a more descriptive fallback message if the check isn't found
      return `No suggestion available for the "${check}" check in the "${category}" category.`;
    }
  } else {
    // Return a more descriptive fallback message if the category isn't found
    return `No suggestions available for the "${category}" category.`;
  }
}

module.exports = { getSuggestion };
