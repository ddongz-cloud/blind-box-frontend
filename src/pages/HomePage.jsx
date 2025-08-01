import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎁 盲盒抽盒机 🎁
          </h1>
          <p className="text-xl text-white opacity-90">
            探索神秘的盲盒世界，发现惊喜收藏品
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* 盲盒系列展示卡片 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">动漫系列</h3>
              <p className="text-gray-600 mb-4">收集你最喜爱的动漫角色</p>
              <button className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors">
                立即抽取
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">游戏系列</h3>
              <p className="text-gray-600 mb-4">游戏角色限定收藏</p>
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                立即抽取
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="h-48 bg-gradient-to-r from-pink-400 to-red-500"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">限定系列</h3>
              <p className="text-gray-600 mb-4">稀有限定款等你发现</p>
              <button className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                立即抽取
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">如何开始？</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
              <div className="text-center">
                <div className="text-4xl mb-2">1️⃣</div>
                <h3 className="font-semibold mb-2">选择系列</h3>
                <p className="text-sm opacity-90">浏览不同的盲盒系列</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">2️⃣</div>
                <h3 className="font-semibold mb-2">抽取盲盒</h3>
                <p className="text-sm opacity-90">点击抽取按钮获得惊喜</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">3️⃣</div>
                <h3 className="font-semibold mb-2">收集展示</h3>
                <p className="text-sm opacity-90">在个人收藏中展示战利品</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
