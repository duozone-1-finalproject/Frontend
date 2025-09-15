import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Download, FileText } from 'lucide-react';
import { Button } from '../common/Button';

interface GuidelineFile {
  name: string;
  displayName: string;
  path: string;
}

const GUIDELINES: GuidelineFile[] = [
  {
    name: '기업공시서식 작성기준',
    displayName: '기업공시서식 작성기준',
    path: '/guidelines/기업공시서식 작성기준.pdf'
  },
  {
    name: '투자위험요소 기재요령 안내서',
    displayName: '투자위험요소 기재요령 안내서',
    path: '/guidelines/투자위험요소 기재요령 안내서.pdf'
  }
];

interface GuidelinesDropdownProps {
  className?: string;
}

export const GuidelinesDropdown: React.FC<GuidelinesDropdownProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFileSelection = (fileName: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileName)) {
      newSelected.delete(fileName);
    } else {
      newSelected.add(fileName);
    }
    setSelectedFiles(newSelected);
  };

  const downloadFile = (file: GuidelineFile) => {
    const link = document.createElement('a');
    link.href = file.path;
    link.download = file.name + '.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSelectedFiles = () => {
    const filesToDownload = GUIDELINES.filter(file => selectedFiles.has(file.name));
    filesToDownload.forEach(file => {
      setTimeout(() => downloadFile(file), 100); // 약간의 지연으로 브라우저 차단 방지
    });
    setSelectedFiles(new Set());
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="sm"
        variant="outline"
        className="bg-white shadow-md hover:bg-gray-50 flex items-center gap-1"
      >
        <FileText className="w-4 h-4" />
        참고자료
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="p-3 border-b border-gray-100">
            <h3 className="font-medium text-gray-900">참고자료 다운로드</h3>
            <p className="text-xs text-gray-500 mt-1">다운로드할 파일을 선택하세요</p>
          </div>

          <div className="p-2 max-h-60 overflow-y-auto">
            {GUIDELINES.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => toggleFileSelection(file.name)}
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.has(file.name)}
                  onChange={() => toggleFileSelection(file.name)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {file.displayName}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadFile(file);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                  title="개별 다운로드"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {selectedFiles.size > 0 && (
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedFiles.size}개 파일 선택됨
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedFiles(new Set())}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    선택 해제
                  </button>
                  <Button
                    onClick={downloadSelectedFiles}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    다운로드
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GuidelinesDropdown;