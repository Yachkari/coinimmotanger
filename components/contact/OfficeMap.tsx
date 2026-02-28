"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

interface Props {
  lat: number;
  lng: number;
  address?: string;
  zoom?: number;
}

export default function OfficeMap({ lat, lng, address, zoom = 15 }: Props) {
  const mapRef      = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);
  const tileRef     = useRef<any>(null);
  const mountedRef  = useRef(false);
  const { theme }   = useTheme();

  // Initial map setup — runs once
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    if (!mapRef.current) return;

    import("leaflet").then((L) => {
      if (!mapRef.current || instanceRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      const map = L.map(mapRef.current, {
        center:             [lat, lng],
        zoom,
        zoomControl:        true,
        scrollWheelZoom:    false,
        attributionControl: true,
      });

      const isDark = document.documentElement.getAttribute("data-theme") !== "light";

      tileRef.current = L.tileLayer(
        isDark
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        }
      ).addTo(map);

      const goldIcon = L.divIcon({
        className: "",
        html: `
          <div class="map-marker">
            <div class="map-marker__pin">
              <svg viewBox="0 0 24 24" fill="none" width="13" height="13">
                <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="#080808" stroke-width="1.5"/>
              </svg>
            </div>
            <div class="map-marker__pulse"></div>
          </div>`,
        iconSize:    [48, 56],
        iconAnchor:  [24, 56],
        popupAnchor: [0, -58],
      });

      const marker = L.marker([lat, lng], { icon: goldIcon }).addTo(map);

      if (address) {
        marker.bindPopup(
          `<div class="map-popup">
            <svg viewBox="0 0 24 24" fill="none" stroke="#b8975a" stroke-width="1.5" width="13" height="13">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>${address}</span>
          </div>`,
          { className: "map-popup-wrap" }
        ).openPopup();
      }

      instanceRef.current = map;
    });
  }, []);

  // Swap tile layer when theme changes
  useEffect(() => {
    if (!instanceRef.current || !tileRef.current) return;

    import("leaflet").then((L) => {
      // Remove old tile layer
      instanceRef.current.removeLayer(tileRef.current);

      // Add new tile layer matching current theme
      tileRef.current = L.tileLayer(
        theme === "light"
          ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        }
      ).addTo(instanceRef.current);
    });
  }, [theme]);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="" />

      <div className="map-wrap">
        <div ref={mapRef} className="map-canvas" />
        <div className="map-fade map-fade--top"    />
        <div className="map-fade map-fade--bottom" />
        <div className="map-fade map-fade--left"   />
        <div className="map-fade map-fade--right"  />
        <div className="map-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="11" height="11">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          Notre agence
        </div>
      </div>

      <style>{`
        .map-wrap {
          position: relative; height: 280px;
          border-radius: var(--r-lg); overflow: hidden;
          border: 1px solid var(--border);
        }
        .map-canvas { width: 100%; height: 100%; background: var(--surface); }

        .map-fade { position: absolute; z-index: 400; pointer-events: none; }
        .map-fade--top    { top:0;left:0;right:0;height:40px;background: linear-gradient(to bottom, var(--map-fade-color) 0%, transparent 100%); }
        .map-fade--bottom { bottom:0;left:0;right:0;height:40px;background: linear-gradient(to top,   var(--map-fade-color) 0%, transparent 100%); }
        .map-fade--left   { top:0;bottom:0;left:0;width:28px;background: linear-gradient(to right, var(--map-fade-color) 0%, transparent 100%); }
        .map-fade--right  { top:0;bottom:0;right:0;width:28px; background: linear-gradient(to left,  var(--map-fade-color) 0%, transparent 100%); }

        .map-label {
          position:absolute;top:12px;left:12px;z-index:401;
          display:flex;align-items:center;gap:6px;
          background: var(--map-bg);backdrop-filter:blur(10px);
          border:1px solid var(--border);border-radius:var(--r-sm);
          padding:5px 10px;font-size:10px;font-weight:600;
          color:var(--muted-2);letter-spacing:.08em;text-transform:uppercase;
        }
        .map-label svg { color:var(--gold); }

        .leaflet-container { background: var(--surface) !important; font-family:var(--font-ui) !important; }
        .leaflet-control-attribution {
          background: var(--map-bg) !important;color:rgba(255,255,255,.25)!important;font-size:9px!important;
        }
        .leaflet-control-attribution a { color:rgba(255,255,255,.35)!important; }
        .leaflet-control-zoom {
          border:1px solid var(--border)!important;border-radius:var(--r-sm)!important;
          overflow:hidden;margin-right:12px!important;margin-bottom:12px!important;
        }
        .leaflet-control-zoom a {
          background: var(--map-zoom-bg) !important;color:var(--muted-2)!important;
          border-bottom:1px solid var(--border)!important;
          width:28px!important;height:28px!important;line-height:28px!important;
          transition:all .15s ease!important;
        }
        .leaflet-control-zoom a:hover { background:rgba(184,151,90,.1)!important;color:var(--gold)!important; }

        .map-marker { position:relative;width:48px;height:56px;display:flex;flex-direction:column;align-items:center; }
        .map-marker__pin {
          width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
          background:var(--gold);display:flex;align-items:center;justify-content:center;
          box-shadow:0 4px 20px rgba(184,151,90,.5);
        }
        .map-marker__pin svg { transform:rotate(45deg); }
        .map-marker__pulse {
          width:12px;height:12px;margin-top:-1px;border-radius:50%;
          background:rgba(184,151,90,.25);animation:pulse-gold 2s ease-in-out infinite;
        }

        .map-popup-wrap .leaflet-popup-content-wrapper {
          background: var(--map-popup-bg) !important;backdrop-filter:blur(16px)!important;
          border:1px solid var(--border)!important;border-radius:var(--r-sm)!important;
          box-shadow:0 8px 32px rgba(0,0,0,.5)!important;padding:0!important;
        }
        .map-popup-wrap .leaflet-popup-content { margin:0!important;padding:0!important; }
        .map-popup-wrap .leaflet-popup-tip-container { display:none; }
        .map-popup {
          display:flex;align-items:center;gap:8px;padding:9px 14px;
          font-size:12px;color:rgba(240,237,232,.8);font-family:var(--font-ui);white-space:nowrap;
        }
      `}</style>
    </>
  );
}