import React from 'react';
import { GroundingChunk } from '../types';

interface SourceLinksProps {
  sources: GroundingChunk[];
}

const SourceLinks: React.FC<SourceLinksProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  // Filter out duplicates based on URI
  const uniqueSources = sources.reduce((acc, current) => {
    const x = acc.find(item => item.web?.uri === current.web?.uri);
    if (!x && current.web) {
      return acc.concat([current]);
    }
    return acc;
  }, [] as GroundingChunk[]);

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        参考来源 (点击跳转官方页面)
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {uniqueSources.map((source, index) => {
          if (!source.web) return null;
          return (
            <a
              key={index}
              href={source.web.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 transition-all group"
            >
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-blue-500 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                </div>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-700">
                  {source.web.title || "未知网页"}
                </p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {new URL(source.web.uri).hostname}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SourceLinks;