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

interface FallbackMapProps {
  language: "zh" | "en";
  center: { lat: number; lng: number };
  zoom: number;
}

/**
 * 替代地圖組件 - 不依賴 Google Maps API，可在 API 無法加載時使用
 */
const FallbackMapComponent: React.FC<FallbackMapProps> = ({
  language,
  center,
  zoom,
}) => {
  // 添加平移和缩放状态
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 处理鼠标/触摸拖动事件
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
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

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
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
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale =
      e.deltaY < 0
        ? Math.min(scale * 1.1, 5) // 放大，最大5倍
        : Math.max(scale / 1.1, 0.5); // 缩小，最小0.5倍
    setScale(newScale);
  };

  // 处理触摸缩放
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length >= 2) {
      const touchDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      (e.currentTarget as any).touchDistance = touchDistance;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length >= 2) {
      const newTouchDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const touchDistance =
        (e.currentTarget as any).touchDistance || newTouchDistance;

      // 计算缩放比例变化
      const delta = newTouchDistance / touchDistance;
      const newScale = Math.min(Math.max(scale * delta, 0.5), 5);

      setScale(newScale);
      (e.currentTarget as any).touchDistance = newTouchDistance;
    }
  };

  // 添加和移除事件监听器
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent | TouchEvent) =>
      handleMouseMove(e);
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

  // 根据参考图像调整点位置
  const familyRouteDots = [
    { left: "20%", top: "10%" }, // 镇南宫石妈祖古道入口
    { left: "30%", top: "20%" }, // 镇南宫
    { left: "45%", top: "35%" }, // 向天溪阶梯
    { left: "55%", top: "60%" }, // 加尔默罗圣母圣衣隐修院
  ];

  // 健行挑战路线的点
  const hikingRouteDots = [
    { left: "10%", top: "15%" }, // 大崎岭步道
    { left: "30%", top: "20%" }, // 镇南宫
    { left: "45%", top: "35%" }, // 向天溪阶梯
    { left: "55%", top: "45%" }, // 阿柔洋山
    { left: "70%", top: "80%" }, // 猴山岳
  ];

  // 路线上的景点位置
  const routePoints = [
    {
      name:
        language === "zh"
          ? "鎮南宮石媽祖古道"
          : "Zhennan Temple Stone Mazu Trail",
      left: "10%",
      top: "10%",
      type: "start",
    },
    {
      name: language === "zh" ? "鎮南宮" : "Zhennan Temple",
      left: "25%",
      top: "25%",
      type: "temple",
    },
    {
      name: language === "zh" ? "向天溪階梯" : "Xiangtian Creek Stairs",
      left: "42%",
      top: "45%",
      type: "stairs",
    },
    {
      name:
        language === "zh" ? "加爾默羅聖母聖衣隱修院" : "Carmelite Monastery",
      left: "55%",
      top: "70%",
      type: "monastery",
    },
  ];

  // 路线距离和时间标记位置
  const distanceMarkers = [
    {
      time: "5",
      distance: "1.9",
      left: "20%",
      top: "20%",
    },
    {
      time: "31",
      distance: "1.9",
      left: "37%",
      top: "38%",
    },
  ];

  // 绘制景点标记
  const attractions = [
    {
      name: language === "zh" ? "竹寮起點" : "Zhuliao Starting Point",
      left: "20%",
      top: "10%",
      color: "var(--sun-yellow)",
      type: "start",
      icon: <Flag className="text-earth-gray" />,
    },
    {
      name:
        language === "zh"
          ? "鎮南宮石媽祖古道"
          : "Zhennan Temple Stone Mazu Trail",
      left: "30%",
      top: "20%",
      color: "var(--earth-gray)",
      type: "temple",
      icon: <Home className="text-earth-gray" />,
    },
    {
      name: language === "zh" ? "向天溪階梯" : "Xiangtian Creek Stairs",
      left: "45%",
      top: "35%",
      color: "var(--sky-blue)",
      type: "stairs",
      icon: <Waves className="text-sky-blue" />,
    },
    {
      name:
        language === "zh" ? "加爾默羅聖母聖衣隱修院" : "Carmelite Monastery",
      left: "55%",
      top: "60%",
      color: "var(--earth-gray)",
      type: "monastery",
      icon: <Home className="text-earth-gray" />,
    },
    {
      name: language === "zh" ? "大崎嶺步道" : "Daqiling Trail",
      left: "10%",
      top: "15%",
      color: "var(--nature-green)",
      type: "trail",
      icon: <Trees className="text-nature-green" />,
    },
    {
      name: language === "zh" ? "阿柔洋山" : "Arouyang Mountain",
      left: "55%",
      top: "45%",
      color: "var(--earth-gray)",
      type: "mountain",
      icon: <Mountain className="text-earth-gray" />,
    },
    {
      name: language === "zh" ? "猴山岳" : "Houshan Mountain",
      left: "70%",
      top: "80%",
      color: "var(--earth-gray)",
      type: "mountain",
      icon: <Mountain className="text-earth-gray" />,
    },
    {
      name: language === "zh" ? "深坑老街休息區" : "Shenkeng Rest Area",
      left: "25%",
      top: "25%",
      color: "var(--cta-orange)",
      type: "rest",
      icon: <Coffee className="text-cta-orange" />,
    },
  ];

  return (
    <div
      className="relative w-full h-full bg-gray-100 rounded-3xl overflow-hidden"
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onTouchStart={(e) => {
        handleMouseDown(e);
        handleTouchStart(e);
      }}
      onTouchMove={handleTouchMove}
    >
      {/* 地圖頭部信息 */}
      <div className="absolute top-0 left-0 right-0 bg-nature-green bg-opacity-20 text-gray-800 px-4 py-3 z-50">
        <div className="flex justify-between items-center">
          <div className="text-lg text-gray-800 flex items-center">
            <Map className="w-5 h-5 mr-2 text-nature-green" />
            {language === "zh" ? (
              <span lang="zh-TW">替代地圖視圖</span>
            ) : (
              "Alternative Map View"
            )}
          </div>
        </div>
      </div>

      {/* 地圖内容 - 使用transform而不是hand-drawn效果 */}
      <div
        className="absolute inset-0 mt-12 mb-10 bg-sky-blue bg-opacity-10"
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          transformOrigin: "center",
        }}
      >
        {/* 路線 */}
        <div className="absolute inset-0">
          {/* 路线SVG覆盖层 */}
          <svg
            className="absolute inset-0 w-full h-full z-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* 家庭路线（蓝色曲线） */}
            <path
              d="M10,20 C12,21 14,22 15,25 L18,35 C20,40 22,45 25,50 C28,55 30,60 35,65 L40,70 C42,72 45,75 50,78"
              fill="none"
              stroke="var(--nature-green)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="none"
              className="family-route"
            />

            {/* 路线起点和终点标记 */}
            <circle
              cx="10"
              cy="20"
              r="1.5"
              fill="white"
              stroke="var(--nature-green)"
              strokeWidth="1"
            />
            <circle
              cx="50"
              cy="78"
              r="1.5"
              fill="white"
              stroke="var(--nature-green)"
              strokeWidth="1"
            />

            {/* 路线中间点标记 */}
            <circle
              cx="18"
              cy="35"
              r="1"
              fill="white"
              stroke="var(--nature-green)"
              strokeWidth="0.8"
            />
            <circle
              cx="35"
              cy="65"
              r="1"
              fill="white"
              stroke="var(--nature-green)"
              strokeWidth="0.8"
            />

            {/* 健行挑战路线（紫色曲线） */}
            <path
              d="M5,15 C8,20 12,25 15,30 L20,35 C25,40 30,45 35,50 C40,55 45,60 55,65 L65,75 C68,78 70,80 75,85"
              fill="none"
              stroke="var(--path-purple)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="none"
              className="hiking-route"
            />

            <circle
              cx="5"
              cy="15"
              r="1.5"
              fill="white"
              stroke="var(--path-purple)"
              strokeWidth="1"
            />
            <circle
              cx="75"
              cy="85"
              r="1.5"
              fill="white"
              stroke="var(--path-purple)"
              strokeWidth="1"
            />

            {/* 其他小道路（虚线） */}
            <path
              d="M10,20 C8,25 7,30 5,35 C4,40 3,45 2,50"
              fill="none"
              stroke="var(--earth-gray)"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2,2"
              opacity="0.7"
            />
            <path
              d="M18,35 C22,32 25,30 30,28 C35,25 40,22 45,20"
              fill="none"
              stroke="var(--earth-gray)"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2,2"
              opacity="0.7"
            />
          </svg>

          {/* 路線距離和時間標記 */}
          {distanceMarkers.map((marker, index) => (
            <div
              key={`distance-${index}`}
              className="absolute hand-drawn-card px-2 py-1 rounded text-xs z-20"
              style={{ left: marker.left, top: marker.top }}
            >
              <div className="flex items-center font-medium text-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{marker.time} 分</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span>{marker.distance} km</span>
              </div>
            </div>
          ))}

          {/* 景點標記 */}
          {attractions.map((attraction, index) => (
            <div
              key={`attraction-${index}`}
              className="absolute z-30 map-point"
              style={{
                left: attraction.left,
                top: attraction.top,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative group">
                <div className="hand-drawn-icon">{attraction.icon}</div>
                <div className="absolute left-full ml-2 top-0 bg-white shadow-md rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity delay-100 tooltip">
                  <div className="font-bold">
                    {language === "zh" ? (
                      <span lang="zh-TW">{attraction.name}</span>
                    ) : (
                      attraction.name
                    )}
                  </div>
                  <div className="text-gray-500">
                    {attraction.type === "temple" ? (
                      language === "zh" ? (
                        <span lang="zh-TW">寺廟</span>
                      ) : (
                        "Temple"
                      )
                    ) : attraction.type === "trail" ? (
                      language === "zh" ? (
                        <span lang="zh-TW">步道</span>
                      ) : (
                        "Trail"
                      )
                    ) : attraction.type === "mountain" ? (
                      language === "zh" ? (
                        <span lang="zh-TW">山岳</span>
                      ) : (
                        "Mountain"
                      )
                    ) : attraction.type === "rest" ? (
                      language === "zh" ? (
                        <span lang="zh-TW">休息區</span>
                      ) : (
                        "Rest Area"
                      )
                    ) : attraction.type === "stairs" ? (
                      language === "zh" ? (
                        <span lang="zh-TW">階梯</span>
                      ) : (
                        "Stairs"
                      )
                    ) : attraction.type === "monastery" ? (
                      language === "zh" ? (
                        <span lang="zh-TW">修道院</span>
                      ) : (
                        "Monastery"
                      )
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 图例 */}
        <div className="absolute bottom-4 right-4 hand-drawn-card p-3 shadow-lg text-xs z-40 bg-white bg-opacity-90">
          <div className="font-title text-sm mb-2 text-gray-800">
            {language === "zh" ? <span lang="zh-TW">图例</span> : "Legend"}
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-2 bg-nature-green mr-1 rounded-full"></div>
            <span>
              {language === "zh" ? (
                <span lang="zh-TW">親子輕鬆探索路線</span>
              ) : (
                "Family Route"
              )}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-2 bg-path-purple mr-1 rounded-full"></div>
            <span>
              {language === "zh" ? (
                <span lang="zh-TW">健行挑戰路線</span>
              ) : (
                "Hiking Route"
              )}
            </span>
          </div>
        </div>

        {/* 北方向指示 */}
        <div className="absolute top-2 left-2 hand-drawn-icon w-8 h-8 bg-white z-10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </div>

        {/* 背景图片 - 使用浅色背景代表地图 */}
        <div className="absolute inset-0 z-0">
          {/* 使用颜色渐变代替图片 */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-blue to-nature-green opacity-10"></div>
          {/* 模拟地图网格 */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(168, 207, 143, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(168, 207, 143, 0.2) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>
          {/* 模拟等高线 */}
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M10,30 Q30,10 50,30 T90,30"
              fill="none"
              stroke="var(--earth-gray)"
              strokeWidth="0.5"
            />
            <path
              d="M10,40 Q30,20 50,40 T90,40"
              fill="none"
              stroke="var(--earth-gray)"
              strokeWidth="0.5"
            />
            <path
              d="M10,50 Q30,30 50,50 T90,50"
              fill="none"
              stroke="var(--earth-gray)"
              strokeWidth="0.5"
            />
            <path
              d="M10,60 Q30,40 50,60 T90,60"
              fill="none"
              stroke="var(--earth-gray)"
              strokeWidth="0.5"
            />
            <path
              d="M10,70 Q30,50 50,70 T90,70"
              fill="none"
              stroke="var(--earth-gray)"
              strokeWidth="0.5"
            />
          </svg>
        </div>
      </div>

      {/* 地图信息栏 */}
      <div className="bg-earth-gray bg-opacity-20 p-3 text-sm text-gray-800">
        <div className="font-title">
          {language === "zh" ? (
            <span lang="zh-TW">深坑步道探險</span>
          ) : (
            "Shenkeng Trails Explorer"
          )}
        </div>
        <div className="text-xs text-gray-600">
          {language === "zh" ? (
            <span lang="zh-TW">包含親子友善路線與健行挑戰路線</span>
          ) : (
            "Includes family-friendly and hiking challenge routes"
          )}
        </div>
      </div>

      {/* 地图説明提示 */}
      <div className="absolute top-12 right-2 p-2 shadow-md text-xs z-50 bg-white bg-opacity-70 rounded-lg">
        <div className="flex items-center mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
          </svg>
          <span>
            {language === "zh" ? (
              <span lang="zh-TW">拖動以平移地圖</span>
            ) : (
              "Drag to pan"
            )}
          </span>
        </div>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            {language === "zh" ? (
              <span lang="zh-TW">雙指縮放調整比例</span>
            ) : (
              "Pinch to zoom"
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FallbackMapComponent;
