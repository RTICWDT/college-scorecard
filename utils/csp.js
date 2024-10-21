export function csp() {
  if (process.env.NODE_ENV === 'development') {
    return {}
  }

  return {
    'http-equiv': "Content-Security-Policy",
    content: `
      default-src 'self' https://*.typekit.net https://dap.digitalgov.gov 
                https://www.google-analytics.com https://www.googletagmanager.com;
      
      img-src 'self' *.googletagmanager.com data: https://*.basemaps.cartocdn.com/ 
              *.cloud.gov *.googleapis.com *.google-analytics.com;
      
      child-src 'none';
      
      script-src-elem * 'unsafe-hashes' 
                      'sha256-gPjlli1HEdLlR0AZTY971/wQVOdSkl9mEinLnxrPpJw=' 
                      'sha256-6egcWvmQP5hRCmW3iDq1X7sXo3/AY4zjQJNgqpm0rAg=' 
                      'sha256-1e5RR2OpHhuX2h0Bat19DsNTmqbo4M3T1pqfeTXCHaA=' 
                      https://*.typekit.net/ 
                      https://fonts.googleapis.com 'self';
      
      connect-src https://api.data.gov https://www.google-analytics.com https://analytics.google.com 
                  https://dap.digitalgov.gov https://stats.g.doubleclick.net 'self' ws:;
      
      font-src https://fonts.gstatic.com https://use.typekit.net 'self';

      frame-src https://td.doubleclick.net/ https://www.google.com;

      style-src 'unsafe-hashes'
                https://fonts.googleapis.com
                https://p.typekit.net
                https://use.typekit.net 'self';
    `
  } 
}