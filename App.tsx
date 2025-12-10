import React, { useState, useCallback } from 'react';
import { searchProductPrice } from './services/geminiService';
import { SearchResult } from './types';
import MarkdownRenderer from './components/MarkdownRenderer';
import SourceLinks from './components/SourceLinks';

// Simple Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setHasSearched(true);

    try {
      const data = await searchProductPrice(query);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header / Hero Section */}
      <header className={`bg-white shadow-sm transition-all duration-500 ease-in-out ${hasSearched ? 'py-4' : 'py-12 md:py-24'}`}>
        <div className="container mx-auto px-4 max-w-4xl text-center">
          {!hasSearched && (
            <div className="mb-8">
               <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                 全网真伪比价助手
               </h1>
               <p className="text-lg text-slate-600">
                 智能识别官方渠道，自动过滤假货/翻新机风险，寻找全网最可靠的最低价。
               </p>
            </div>
          )}

          <div className={`transition-all duration-500 ${hasSearched ? 'flex items-center justify-between gap-4' : ''}`}>
            {hasSearched && (
               <div className="hidden md:block text-left">
                  <h2 className="text-xl font-bold text-slate-800">真伪比价助手</h2>
               </div>
            )}
            
            <form onSubmit={handleSearch} className={`relative flex-1 max-w-2xl mx-auto ${hasSearched ? 'mx-0' : ''}`}>
              <div className="relative group">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="输入商品名称 (例如: iPhone 15 Pro Max)"
                  className="w-full pl-5 pr-14 py-4 rounded-2xl border-2 border-slate-200 bg-white text-lg text-slate-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <SearchIcon />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Loading Skeleton */}
        {isLoading && !result && (
           <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
             <div className="flex items-center space-x-2 mb-6">
                <div className="h-4 w-4 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="text-blue-600 font-medium text-sm">正在全网搜索并核实店铺资质...</div>
             </div>
             <div className="h-32 bg-slate-200 rounded-xl"></div>
             <div className="h-64 bg-slate-200 rounded-xl"></div>
             <div className="h-12 bg-slate-200 rounded-xl w-3/4"></div>
           </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700 max-w-2xl mx-auto">
            <p className="font-semibold text-lg mb-2">出错了</p>
            <p>{error}</p>
          </div>
        )}

        {/* Results */}
        {result && !isLoading && (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                分析报告: <span className="text-blue-600">"{query}"</span>
              </h2>
              <span className="text-xs md:text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-200 flex items-center">
                 <span className="mr-1">🛡️</span> 已开启真伪过滤
              </span>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8">
              {/* Main Text Content (Parsed Markdown) */}
              <MarkdownRenderer content={result.text} />

              {/* Source Links (Grounding) */}
              <SourceLinks sources={result.groundingChunks} />
            </div>

            {/* Disclaimer */}
            <p className="text-center text-slate-400 text-xs mt-8">
              * AI 分析基于公开网络信息，仅供参考。购物时请务必再次核实店铺资质（如查看营业执照、官方认证标识等）。
            </p>
          </div>
        )}

        {/* Empty State / Suggestions */}
        {!hasSearched && (
           <div className="mt-12 text-center">
              <h3 className="text-slate-500 font-medium mb-6">热门防坑搜索</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['AirPods Pro 2', '始祖鸟冲锋衣', '戴森吹风机', '海蓝之谜面霜'].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setQuery(item);
                      // Slight delay to allow state update before triggering search
                      setTimeout(() => {
                        const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                        handleSearch(fakeEvent);
                      }, 0);
                    }}
                    className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 rounded-full text-slate-600 text-sm transition-colors shadow-sm"
                  >
                    {item}
                  </button>
                ))}
              </div>
           </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} 全网真伪比价助手. Powered by Gemini.
        </div>
      </footer>
    </div>
  );
};

export default App;