import React, { useState, useEffect } from "react";
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
import GoogleMapComponent from "./components/GoogleMapComponent";
import FallbackMapComponent from "./components/FallbackMapComponent";
import EmbeddedGoogleMapComponent from "./components/EmbeddedGoogleMapComponent";

// 主要應用程式組件
export default function InteractiveMap() {
  // 狀態管理
  const [language, setLanguage] = useState("zh"); // 'zh' 中文, 'en' 英文
  const [showFamilyFriendly, setShowFamilyFriendly] = useState(false);
  const [showTrailsOnly, setShowTrailsOnly] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [useFallbackMap, setUseFallbackMap] = useState(true); // 默认使用简易地图
  const [isLoading, setIsLoading] = useState(true);
  const [useEmbeddedMap, setUseEmbeddedMap] = useState(true); // 更改為默認顯示嵌入式地圖

  useEffect(() => {
    // 模拟加载
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // 地图中心 - 設置為深坑區中心的位置
  const mapCenter = { lat: 25.0014, lng: 121.6242 };
  const mapZoom = 14; // 深坑區視圖

  // 路線資料 - 實際路線數據
  const trails = [
    {
      id: 1,
      name: {
        zh: "親子輕鬆探索路線",
        en: "Family-friendly Exploration Route",
      },
      url: "https://www.google.com/maps/dir/向天溪階梯/鎮南宮石媽祖古道/加爾默羅聖母聖衣隱修院",
      color: "var(--nature-green)", // 使用CSS变量
      familyFriendly: true,
      difficulty: "简单",
      distance: "3.8公里",
      time: "1小时30分钟",
      coordinates: [
        { lat: 25.0, lng: 121.618 }, // 向天溪階梯
        { lat: 24.997, lng: 121.621 }, // 鎮南宮石媽祖古道
        { lat: 24.995, lng: 121.625 }, // 加爾默羅聖母聖衣隱修院
      ],
    },
    {
      id: 2,
      name: {
        zh: "健行挑戰路線",
        en: "Hiking Challenge Route",
      },
      url: "https://www.google.com/maps/dir/大崎嶺步道/向天溪階梯/阿柔洋山/猴山岳",
      color: "var(--path-purple)", // 使用CSS变量
      familyFriendly: false,
      difficulty: "中等",
      distance: "9公里",
      time: "2小时37分钟",
      coordinates: [
        { lat: 25.005, lng: 121.615 }, // 大崎嶺步道
        { lat: 25.0, lng: 121.618 }, // 向天溪階梯
        { lat: 24.993, lng: 121.628 }, // 阿柔洋山
        { lat: 24.99, lng: 121.632 }, // 猴山岳
      ],
    },
  ];

  // 景點資料 - 實際景點數據
  const attractions = [
    {
      id: 1,
      name: {
        zh: "向天溪階梯",
        en: "Xiangtian Creek Stairs",
      },
      type: "stairs",
      icon: <Waves className="text-sky-blue" />,
      position: { lat: 25.0, lng: 121.618 },
      familyFriendly: true,
      onTrail: 1,
    },
    {
      id: 2,
      name: {
        zh: "鎮南宮石媽祖古道",
        en: "Zhennan Temple Stone Mazu Trail",
      },
      type: "temple",
      icon: <Home className="text-earth-gray" />,
      position: { lat: 24.997, lng: 121.621 },
      familyFriendly: true,
      onTrail: 1,
    },
    {
      id: 3,
      name: {
        zh: "加爾默羅聖母聖衣隱修院",
        en: "Carmelite Monastery",
      },
      type: "monastery",
      icon: <Home className="text-earth-gray" />,
      position: { lat: 24.995, lng: 121.625 },
      familyFriendly: true,
      onTrail: 1,
    },
    {
      id: 4,
      name: {
        zh: "大崎嶺步道",
        en: "Daqiling Trail",
      },
      type: "trail",
      icon: <Trees className="text-nature-green" />,
      position: { lat: 25.005, lng: 121.615 },
      familyFriendly: false,
      onTrail: 2,
    },
    {
      id: 5,
      name: {
        zh: "阿柔洋山",
        en: "Arouyang Mountain",
      },
      type: "mountain",
      icon: <Mountain className="text-earth-gray" />,
      position: { lat: 24.993, lng: 121.628 },
      familyFriendly: false,
      onTrail: 2,
    },
    {
      id: 6,
      name: {
        zh: "猴山岳",
        en: "Houshan Mountain",
      },
      type: "mountain",
      icon: <Mountain className="text-earth-gray" />,
      position: { lat: 24.99, lng: 121.632 },
      familyFriendly: false,
      onTrail: 2,
    },
    {
      id: 7,
      name: {
        zh: "深坑老街休息區",
        en: "Shenkeng Old Street Rest Area",
      },
      type: "rest",
      icon: <Coffee className="text-cta-orange" />,
      position: { lat: 25.002, lng: 121.62 },
      familyFriendly: true,
      onTrail: 1,
    },
  ];

  const handleAttractionHover = (id) => {
    setActiveTooltip(id);
  };

  const handleAttractionLeave = () => {
    setActiveTooltip(null);
  };

  const toggleLanguage = () => {
    setLanguage(language === "zh" ? "en" : "zh");
  };

  // 過濾數據根據當前設置
  const filteredTrails = trails.filter((trail) => {
    if (showFamilyFriendly) {
      return trail.familyFriendly;
    }
    return true;
  });

  const filteredAttractions = attractions.filter((attraction) => {
    if (showFamilyFriendly && !attraction.familyFriendly) {
      return false;
    }

    if (showTrailsOnly) {
      return trails.some((trail) => trail.coordinates.some(
        (coord) => {
          const latDiff = Math.abs(coord.lat - attraction.position.lat);
          const lngDiff = Math.abs(coord.lng - attraction.position.lng);
          return latDiff < 0.005 && lngDiff < 0.005; // 大約500米範圍內
        }
      ));
    }

    return true;
  });

  // 檢查Google Maps API是否可用
  const checkGoogleMapsApi = () => {
    if (window.google && window.google.maps) {
      setUseFallbackMap(false);
    } else {
      setUseFallbackMap(true);
    }
  };

  useEffect(() => {
    // 嘗試加載Google Maps API
    checkGoogleMapsApi();
  }, []);

  // 切換地圖類型
  const toggleMapType = () => {
    if (useFallbackMap) {
      // 嘗試使用Google Maps
      checkGoogleMapsApi();
    } else {
      // 強制使用備用地圖
      setUseFallbackMap(true);
    }
  };

  // 切換嵌入式地圖
  const toggleEmbeddedMap = () => {
    setUseEmbeddedMap(!useEmbeddedMap);
  };

  // 主要渲染
  return (
    <div className="map-container">
      {isLoading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>{language === "zh" ? "載入中..." : "Loading..."}</p>
        </div>
      ) : (
        <>
          <div className="map-header">
            <h1 className="map-title">
              {language === "zh" ? "深坑步道互動地圖" : "Shenkeng Trails Interactive Map"}
            </h1>
            <div className="map-controls">
              <button
                className="map-control-btn"
                onClick={toggleLanguage}
                title={language === "zh" ? "Switch to English" : "切換為中文"}
              >
                {language === "zh" ? "EN" : "中"}
              </button>
              <button
                className={`map-control-btn ${showFamilyFriendly ? "active" : ""}`}
                onClick={() => setShowFamilyFriendly(!showFamilyFriendly)}
                title={
                  language === "zh" ? "顯示親子友善路線" : "Show Family-Friendly Routes"
                }
              >
                <Users />
              </button>
              <button
                className={`map-control-btn ${showTrailsOnly ? "active" : ""}`}
                onClick={() => setShowTrailsOnly(!showTrailsOnly)}
                title={
                  language === "zh" ? "只顯示步道上的景點" : "Show Only Trail Attractions"
                }
              >
                <Flag />
              </button>
              <button
                className="map-control-btn"
                onClick={toggleMapType}
                title={
                  useFallbackMap
                    ? language === "zh"
                      ? "使用Google地圖"
                      : "Use Google Maps"
                    : language === "zh"
                    ? "使用簡易地圖"
                    : "Use Simple Map"
                }
              >
                <Map />
              </button>
              <button
                className={`map-control-btn ${useEmbeddedMap ? "active" : ""}`}
                onClick={toggleEmbeddedMap}
                title={
                  useEmbeddedMap
                    ? language === "zh"
                      ? "使用互動地圖"
                      : "Use Interactive Map"
                    : language === "zh"
                    ? "使用Google地圖"
                    : "Use Google Maps"
                }
              >
                <MapPin />
              </button>
            </div>
          </div>

          <div className="map-wrapper">
            {useEmbeddedMap ? (
              // 嵌入式Google地圖
              <EmbeddedGoogleMapComponent language={language} />
            ) : useFallbackMap ? (
              // 備用地圖
              <FallbackMapComponent
                center={mapCenter}
                zoom={mapZoom}
                trails={filteredTrails}
                attractions={filteredAttractions}
                language={language}
                activeTooltip={activeTooltip}
                onAttractionHover={handleAttractionHover}
                onAttractionLeave={handleAttractionLeave}
              />
            ) : (
              // Google地圖
              <GoogleMapComponent
                center={mapCenter}
                zoom={mapZoom}
                trails={filteredTrails}
                attractions={filteredAttractions}
                language={language}
                activeTooltip={activeTooltip}
                onAttractionHover={handleAttractionHover}
                onAttractionLeave={handleAttractionLeave}
              />
            )}
          </div>

          <div className="map-legend">
            <h3>{language === "zh" ? "圖例" : "Legend"}</h3>
            <div className="legend-items">
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "var(--nature-green)" }}
                ></div>
                <span>
                  {language === "zh" ? "親子輕鬆探索路線" : "Family-friendly Route"}
                </span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "var(--path-purple)" }}
                ></div>
                <span>{language === "zh" ? "健行挑戰路線" : "Hiking Challenge Route"}</span>
              </div>
              <div className="legend-item">
                <Trees className="legend-icon text-nature-green" />
                <span>{language === "zh" ? "步道入口" : "Trail Entrance"}</span>
              </div>
              <div className="legend-item">
                <Home className="legend-icon text-earth-gray" />
                <span>{language === "zh" ? "古蹟/寺廟" : "Historic Site/Temple"}</span>
              </div>
              <div className="legend-item">
                <Mountain className="legend-icon text-earth-gray" />
                <span>{language === "zh" ? "山峰" : "Mountain Peak"}</span>
              </div>
              <div className="legend-item">
                <Waves className="legend-icon text-sky-blue" />
                <span>{language === "zh" ? "溪流" : "Stream"}</span>
              </div>
              <div className="legend-item">
                <Coffee className="legend-icon text-cta-orange" />
                <span>{language === "zh" ? "休息區" : "Rest Area"}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 