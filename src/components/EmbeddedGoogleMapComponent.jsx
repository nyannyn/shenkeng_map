import React, { useState } from "react";

/**
 * 嵌入式Google地圖組件
 * 使用用戶提供的Google地圖URL
 */
const EmbeddedGoogleMapComponent = ({
  language,
}) => {
  // Google地圖嵌入URL - 更新為包含ehbc參數的完整URL
  const mapUrl =
    "https://www.google.com/maps/d/embed?mid=12Sm7DMQB4uIFyuD7wug7vRSdtpOALfU&ehbc=2E312F";

  // 添加加載狀態
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // 處理iframe加載完成
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // 處理iframe加載錯誤
  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="embedded-map-container">
      {/* 嵌入的Google地圖 */}
      <div className="relative h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-10 z-10">
            <div className="text-center">
              <div className="spinner mb-4"></div>
              <p className="text-xl text-gray-800">
                {language === "zh" ? "載入中..." : "Loading..."}
              </p>
            </div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-5 z-10">
            <div className="text-center max-w-md p-6 bg-white bg-opacity-90 rounded-2xl shadow-lg">
              <p className="text-xl text-gray-800 mb-2">
                {language === "zh" ? "地圖載入失敗" : "Map Loading Failed"}
              </p>
              <p className="text-gray-600 mb-4">
                {language === "zh"
                  ? "無法載入Google地圖。請確保您已連接到網絡並允許載入第三方內容。"
                  : "Could not load Google Maps. Please ensure you are connected to the internet and allow third-party content."}
              </p>
              <button
                onClick={() => window.open(mapUrl, "_blank")}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                {language === "zh" ? "在新視窗開啟地圖" : "Open Map in New Window"}
              </button>
            </div>
          </div>
        )}

        <div className="h-full">
          <iframe
            src={mapUrl}
            className="embedded-map"
            frameBorder="0"
            allowFullScreen={true}
            aria-hidden="false"
            tabIndex={0}
            title="深坑步道探險地圖"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          ></iframe>
        </div>
      </div>

      {/* 地圖信息栏 */}
      <div className="px-4 py-3 text-sm text-gray-800 bg-gray-100">
        <div className="flex justify-between items-center">
          <div>
            {language === "zh" ? "深坑步道地圖導覽" : "Shenkeng Trails Guide"}
          </div>
          <div className="text-xs text-gray-600">
            {language === "zh" ? "親子友善 · 健行挑戰" : "Family-friendly · Hiking"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbeddedGoogleMapComponent; 