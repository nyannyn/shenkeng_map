import React, { useState, useEffect } from "react";

interface EmbeddedGoogleMapProps {
  language: "zh" | "en";
}

/**
 * 嵌入式Google地圖組件
 * 使用用戶提供的Google地圖URL
 */
const EmbeddedGoogleMapComponent: React.FC<EmbeddedGoogleMapProps> = ({
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
    <div className="w-full h-full flex flex-col rounded-3xl overflow-hidden relative">
      {/* 水彩暈染背景 */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          background: `linear-gradient(135deg, var(--nature-green) 0%, rgba(168, 207, 143, 0.6) 50%, var(--sky-blue) 100%)`,
          borderRadius: "24px 20px 22px 18px / 20px 22px 18px 24px",
        }}
      ></div>

      {/* 裝飾性植物元素 */}
      <div className="absolute top-2 right-2 h-16 w-16 opacity-20 z-0">
        <div
          className="plant-illustration"
          style={{ transform: "scale(0.3)" }}
        ></div>
      </div>

      {/* 地圖頭部信息 */}
      <div className="bg-nature-green bg-opacity-20 text-gray-800 px-4 py-3 z-10 relative">
        <div className="flex justify-between items-center">
          <div className="text-lg text-gray-800 flex items-center">
            <div className="w-1.5 h-6 bg-nature-green mr-2 rounded-full opacity-70"></div>
            {language === "zh" ? (
              <span lang="zh-TW">深坑步道探險</span>
            ) : (
              "Shenkeng Trails Explorer"
            )}
          </div>
          <div className="text-xs flex items-center">
            <div className="w-6 h-6 mr-2 overflow-visible flex items-center justify-center bg-white bg-opacity-70 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-nature-green h-3.5 w-3.5"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"></path>
              </svg>
            </div>
            <span className="text-gray-700">
              {language === "zh" ? (
                <span lang="zh-TW">Google 地圖</span>
              ) : (
                "Google Maps"
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 嵌入的Google地圖 */}
      <div className="flex-grow relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-nature-green bg-opacity-10 z-10">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-nature-green border-r-transparent mb-4"></div>
              <p className="font-title text-xl text-gray-800">
                {language === "zh" ? (
                  <span lang="zh-TW">載入中...</span>
                ) : (
                  "Loading..."
                )}
              </p>
            </div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-nature-green bg-opacity-5 z-10">
            <div
              className="text-center max-w-md p-6 bg-white bg-opacity-90 rounded-2xl shadow-lg"
              style={{
                borderRadius: "20px 18px 22px 20px / 18px 22px 18px 22px",
              }}
            >
              <p className="font-title text-xl text-gray-800 mb-2">
                {language === "zh" ? (
                  <span lang="zh-TW">地圖載入失敗</span>
                ) : (
                  "Map Loading Failed"
                )}
              </p>
              <p className="text-gray-600 mb-4">
                {language === "zh" ? (
                  <span lang="zh-TW">
                    無法載入Google地圖。請確保您已連接到網絡並允許載入第三方內容。
                  </span>
                ) : (
                  "Could not load Google Maps. Please ensure you are connected to the internet and allow third-party content."
                )}
              </p>
              <button
                onClick={() => window.open(mapUrl, "_blank")}
                className="hand-drawn-btn nature px-4 py-2 text-white"
              >
                {language === "zh" ? (
                  <span lang="zh-TW">在新視窗開啟地圖</span>
                ) : (
                  "Open Map in New Window"
                )}
              </button>
            </div>
          </div>
        )}

        <div className="absolute inset-0 rounded-lg overflow-hidden z-0">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen={true}
            aria-hidden="false"
            tabIndex={0}
            title="深坑步道探險地圖"
            className="absolute inset-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          ></iframe>
        </div>
      </div>

      {/* 地圖信息栏 */}
      <div className="bg-nature-green bg-opacity-20 px-4 py-3 text-sm text-gray-800 z-10 relative">
        <div className="flex justify-between items-center">
          <div>
            {language === "zh" ? (
              <span lang="zh-TW">深坑步道地圖導覽</span>
            ) : (
              "Shenkeng Trails Guide"
            )}
          </div>
          <div className="text-xs text-gray-600 bg-white bg-opacity-50 px-2 py-1 rounded-full">
            {language === "zh" ? (
              <span lang="zh-TW">親子友善 · 健行挑戰</span>
            ) : (
              "Family-friendly · Hiking"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbeddedGoogleMapComponent;
