import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // A very basic parser to handle specific markdown elements we asked Gemini for.
  // In a production app, use 'react-markdown'. Here we implement a simple customized view.
  
  const sections = content.split('###').filter(Boolean);

  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        const lines = section.trim().split('\n');
        const title = lines[0].trim();
        const body = lines.slice(1).join('\n').trim();

        if (title.includes('渠道可信度') || title.includes('真伪分析')) {
           return (
             <div key={index} className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm">
               <h3 className="text-lg font-bold text-amber-800 mb-2 flex items-center">
                 <span className="mr-2">🛡️</span> {title}
               </h3>
               <div className="text-amber-900 leading-relaxed text-md whitespace-pre-line">
                  {body.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('\n').map((line, i) => (
                      <p key={i} dangerouslySetInnerHTML={{ __html: line }} className="mb-1"></p>
                  ))}
               </div>
             </div>
           );
        }

        if (title.includes('最佳价格') || title.includes('价格结论')) {
           return (
             <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm">
               <h3 className="text-lg font-bold text-green-800 mb-2 flex items-center">
                 <span className="mr-2">🏆</span> {title}
               </h3>
               <p className="text-green-900 leading-relaxed text-lg font-medium">{body}</p>
             </div>
           );
        }

        if (title.includes('价格详情表')) {
          // Simple table parser
          const tableRows = body.split('\n').filter(line => line.trim().startsWith('|'));
          if (tableRows.length > 2) {
             // Skip header separator line (e.g. |---|---|)
             const headers = tableRows[0].split('|').filter(c => c.trim()).map(c => c.trim());
             const dataRows = tableRows.slice(2).map(row => 
                row.split('|').filter(c => c !== undefined).slice(1, -1).map(c => c.trim())
             );

             return (
               <div key={index} className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                 <table className="w-full text-left text-sm text-gray-600 bg-white">
                   <thead className="bg-gray-100 uppercase font-semibold text-gray-700">
                     <tr>
                       {headers.map((h, i) => <th key={i} className="px-6 py-3">{h}</th>)}
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-200">
                     {dataRows.map((row, rI) => (
                       <tr key={rI} className="hover:bg-gray-50 transition-colors">
                         {row.map((cell, cI) => <td key={cI} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{cell}</td>)}
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             );
          }
        }

        // Default rendering for other sections (like Advice) or raw text fallback
        return (
          <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>
             <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                {body.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('\n').map((line, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: line }} className="mb-1"></p>
                ))}
             </div>
          </div>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;