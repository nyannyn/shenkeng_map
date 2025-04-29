import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  Polyline,
} from "@react-google-maps/api";
import FallbackMapComponent from "./FallbackMapComponent";

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  attractions?: any[];
  trails?: any[];
  activeTooltip?: number | null;
  onMarkerHover?: (id: number) => void;
  onMarkerLeave?: () => void;
  showFamilyFriendly?: boolean;
  showTrailsOnly?: boolean;
  language?: "zh" | "en";
}

// 地圖容器樣式
const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.5rem",
};

const GoogleMapComponent: React.FC<MapProps> = ({
  center,
  zoom,
  attractions = [],
  trails = [],
  activeTooltip = null,
  onMarkerHover = () => {},
  onMarkerLeave = () => {},
  showFamilyFriendly = false,
  showTrailsOnly = false,
  language = "zh",
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // 检查 Google Maps API 是否已加载
  const isGoogleMapsLoaded =
    typeof window.google !== "undefined" &&
    typeof window.google.maps !== "undefined";

  // 處理地圖加載完成
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setMapLoaded(true);
  }, []);

  // 過濾要顯示的景點
  const filteredAttractions = attractions.filter((attr) => {
    if (showFamilyFriendly && !attr.familyFriendly) return false;
    if (showTrailsOnly) {
      const trail = trails.find((t) => t.id === attr.onTrail);
      if (showFamilyFriendly && trail && !trail.familyFriendly) return false;
    }
    return true;
  });

  // 如果 Google Maps 未加载，使用备用地圖組件
  if (!isGoogleMapsLoaded || mapError) {
    return (
      <FallbackMapComponent language={language} center={center} zoom={zoom} />
    );
  }

  return (
    <div style={containerStyle}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onMapLoad}
        options={{
          gestureHandling: "cooperative",
          disableDefaultUI: false,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          styles: [
            {
              featureType: "poi.business",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
      >
        {/* 路線 */}
        {trails.map((trail) => (
          <Polyline
            key={`trail-${trail.id}`}
            path={trail.coordinates}
            options={{
              strokeColor: trail.color,
              strokeOpacity:
                showTrailsOnly && showFamilyFriendly && !trail.familyFriendly
                  ? 0.5
                  : 1,
              strokeWeight: 3,
            }}
          />
        ))}

        {/* 景點標記 */}
        {filteredAttractions.map((attraction) => (
          <Marker
            key={`marker-${attraction.id}`}
            position={attraction.position}
            onClick={() => onMarkerHover(attraction.id)}
            onMouseOver={() => onMarkerHover(attraction.id)}
            onMouseOut={onMarkerLeave}
            icon={{
              url: `/icons/${attraction.type}.svg`,
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        ))}

        {/* 信息窗口 */}
        {activeTooltip !== null && attractions.length > 0 && (
          <InfoWindow
            position={attractions.find((a) => a.id === activeTooltip)?.position}
            onCloseClick={onMarkerLeave}
          >
            <div className="p-1">
              <p className="font-medium">
                {
                  attractions.find((a) => a.id === activeTooltip)?.name[
                    language
                  ]
                }
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;
