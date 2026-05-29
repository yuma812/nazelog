import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const typeColors = {
  kando:  "#f5c842",
  action: "#7F77DD",
  kizuki: "#1D9E75",
  gimon:  "#D85A30",
};

const typeEmoji = {
  kando: "🤩", action: "🎯", kizuki: "💡", gimon: "❓"
};

export default function Map({ posts, onPinClick }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [130.7239, 32.8097],
      zoom: 14,
    });
  }, []);

  useEffect(() => {
    if (!map.current || !posts.length) return;

    posts.forEach(post => {
      if (!post.lng || !post.lat) return;

      const el = document.createElement("div");
      el.style.cssText = `
        width: 36px; height: 36px; border-radius: 50%;
        background: ${typeColors[post.type] || "#f5c842"};
        border: 3px solid white;
        display: flex; align-items: center; justify-content: center;
        font-size: 17px; cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;
      el.innerText = typeEmoji[post.type] || "🤩";
      el.addEventListener("click", () => onPinClick(post));

      new mapboxgl.Marker(el)
        .setLngLat([post.lng, post.lat])
        .addTo(map.current);
    });
  }, [posts]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
}