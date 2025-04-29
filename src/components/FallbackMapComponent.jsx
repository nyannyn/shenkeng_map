import React, { useState, useRef, useEffect } from "react";
import {
  Map,
  Flag,
  Coffee,
  Users,
  MapPin,
  Home,
  Sun,
  Waves,
  Mountain,
  Trees,
} from "lucide-react";

/**
 * 替代地圖組件 - 不依賴 Google Maps API，可在 API 無法加載時使用
 */
const FallbackMapComponent = ({
  language,
  center,
  zoom,
  trails = [],
  attractions = [],
  activeTooltip = null,
  onAttractionHover = () => {},
  onAttractionLeave = () => {},
}) => {
  // 添加平移和缩放状态
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // 处理鼠标/触摸拖动事件
  const handleMouseDown = (e) => {
    setIsDragging(true);
    if ("touches" in e) {
      setStartPosition({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    } else {
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    if ("touches" in e) {
      setPosition({
        x: e.touches[0].clientX - startPosition.x,
        y: e.touches[0].clientY - startPosition.y,
      });
    } else {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 处理滚轮/手势缩放
  const handleWheel = (e) => {
    e.preventDefault();
    const newScale =
      e.deltaY < 0
        ? Math.min(scale * 1.1, 5) // 放大，最大5倍
        : Math.max(scale / 1.1, 0.5); // 缩小，最小0.5倍
    setScale(newScale);
  };

  // 添加和移除事件监听器
  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchmove", handleGlobalMouseMove);
    window.addEventListener("touchend", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchmove", handleGlobalMouseMove);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, [isDragging, startPosition]);

  // 縮放控制
  const zoomIn = () => {
    setScale(Math.min(scale * 1.2, 5));
  };

  const zoomOut = () => {
    setScale(Math.max(scale / 1.2, 0.5));
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="fallback-map-container">
      <div
        ref={containerRef}
        className="fallback-map"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onWheel={handleWheel}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "center",
            transition: isDragging ? "none" : "transform 0.1s ease",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {/* 渲染路線 */}
          {trails.map((trail) => (
            <div 
              key={`trail-${trail.id}`}
              className="trail-path"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: trail.color,
                opacity: 0.1,
                clipPath: 'polygon(20% 20%, 40% 40%, 60% 60%, 80% 40%)',
                zIndex: 1
              }}
            />
          ))}

          {/* 渲染景點 */}
          {attractions.map((attraction) => (
            <div
              key={`attraction-${attraction.id}`}
              className="attraction-marker"
              style={{
                left: `${(attraction.id * 10) + 20}%`,
                top: `${(attraction.id * 8) + 10}%`,
                zIndex: activeTooltip === attraction.id ? 10 : 5,
              }}
              onMouseEnter={() => onAttractionHover(attraction.id)}
              onMouseLeave={onAttractionLeave}
            >
              <div className="marker">
                {attraction.icon}
              </div>
              <div className={`attraction-tooltip ${activeTooltip === attraction.id ? 'active' : ''}`}>
                {attraction.name[language]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 地圖控制器 */}
      <div className="fallback-map-controls">
        <button className="fallback-map-control" onClick={zoomIn}>
          <span>+</span>
        </button>
        <button className="fallback-map-control" onClick={zoomOut}>
          <span>-</span>
        </button>
        <button className="fallback-map-control" onClick={resetView}>
          <MapPin size={16} />
        </button>
      </div>
    </div>
  );
};

export default FallbackMapComponent; 