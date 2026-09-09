// Simpele, best-effort omzetting van een user-agent string naar iets
// leesbaars voor mensen (bijv. "Chrome op Windows") — geen volledige
// UA-parser, alleen genoeg om een gebruiker een inlogmoment te laten
// herkennen in het activiteitenoverzicht.
export function leesbareDeviceLabel(ua: string): string {
  const os = /iPhone|iPad/.test(ua) ? "iOS"
    : /Android/.test(ua) ? "Android"
    : /Mac OS X/.test(ua) ? "macOS"
    : /Windows/.test(ua) ? "Windows"
    : /Linux/.test(ua) ? "Linux"
    : "onbekend apparaat";

  const browser = /Edg\//.test(ua) ? "Edge"
    : /OPR\//.test(ua) ? "Opera"
    : /Chrome\//.test(ua) ? "Chrome"
    : /CriOS\//.test(ua) ? "Chrome"
    : /FxiOS\//.test(ua) ? "Firefox"
    : /Firefox\//.test(ua) ? "Firefox"
    : /Safari\//.test(ua) ? "Safari"
    : "een browser";

  return `${browser} op ${os}`;
}
