import React from 'react';
const History=()=>{

    return(
        <div className="sidebar flex flex-col h-full">
            <div className="history-log bg-gray-300 text-gray-800 p-3 rounded-lg max-w-xs mb-2">
                <p>Q. 질문요약</p>
                <p>A. 질문답변</p>
            </div>
            <div className="history-log bg-gray-300 text-gray-800 p-3 rounded-lg max-w-xs mb-2">
                <p>A. 질문답변</p>
                <p>Q. 질문요약</p>
            </div>
            <div className="history-log bg-gray-300 text-gray-800 p-3 rounded-lg max-w-xs mb-2">
                <p>Q. 질문요약</p>
                <p>A. 질문답변</p>
            </div>
        </div>
    );
}
export default History;