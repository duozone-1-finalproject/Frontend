import React, { useState, useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

// --- CompanyList 컴포넌트 ---
// FIX 1: Props에 대한 타입을 명시적으로 정의했습니다.
interface CompanyListProps {
  searchTerm?: string; // searchTerm은 선택적(optional) props로 변경
}

const CompanyList: React.FC<CompanyListProps> = ({ searchTerm = '' }) => {
  const companies = [
    { name: '삼성전자', code: '005930' },
    { name: 'SK하이닉스', code: '000660' },
    { name: 'NAVER', code: '035420' },
    { name: '카카오', code: '035720' },
    { name: 'LG화학', code: '051910' },
    { name: '삼성SDI', code: '006400' },
    // ... (나머지 데이터는 동일)
  ];

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.code.includes(searchTerm)
  );

  return (
    <div className="space-y-2">
      {filteredCompanies.length > 0 ? (
        filteredCompanies.map((company) => (
          <div 
            key={company.code} 
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => console.log('선택된 기업:', company)}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">{company.name}</span>
              <span className="text-sm text-gray-500">{company.code}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>검색 결과가 없습니다.</p>
          <p className="text-sm mt-1">기업명이나 코드를 다시 확인해주세요.</p>
        </div>
      )}
    </div>
  );
};

// --- Modal 컴포넌트 ---
interface MyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode; // FIX 2: children prop 타입을 명시적으로 추가했습니다.
  // ADDED 1: 검색 기능을 위해 새로운 props 추가
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Modal: React.FC<MyModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  searchTerm,      // ADDED 2: 새로 추가된 props 받기
  onSearchChange   // ADDED 2: 새로 추가된 props 받기
}) => {
  useEffect(() => {
    // FIX 3: document에 등록하는 이벤트는 React.KeyboardEvent가 아닌 네이티브 KeyboardEvent 타입입니다.
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      <div 
        className="relative bg-white rounded-lg shadow-xl"
        style={{ width: '500px', height: '600px' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            {/* FIX 4: 검색창을 제어 컴포넌트로 변경 (value, onChange 추가) */}
            <input
              type="text"
              placeholder="기업명을 입력하세요..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={onSearchChange}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div 
          className="p-4 overflow-y-auto"
          style={{ height: 'calc(600px - 73px - 73px)' }}
        >
          {children} {/* children을 여기서 렌더링 */}
        </div>
      </div>
    </div>
  );
};


// --- App 컴포넌트 ---
const CorpSelectModal = () => {
  const [showModal, setShowModal] = useState(false);
  // ADDED 3: 검색어 상태 관리를 위한 state 추가
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">기업 선택 모달</h1>
        
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          기업 선택 모달 열기
        </button>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="기업 목록"
          // ADDED 4: 검색 관련 state와 핸들러를 props로 전달
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        >
          {/* FIX 5: children으로 CompanyList 컴포넌트를 렌더링하고 searchTerm을 전달 */}
          <CompanyList searchTerm={searchTerm} />
        </Modal>
      </div>
    </div>
  );
};

export default CorpSelectModal;