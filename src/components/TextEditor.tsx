// src/components/TextEditor.tsx (기존 파일을 이것으로 교체)
import React, { useEffect, useRef, useState } from 'react';

interface TextEditorProps {
  initialContent: string;
  onContentChange: (html: string) => void;
  isReadOnly?: boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({ 
  initialContent, 
  onContentChange, 
  isReadOnly = false 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState('저장되지 않음');
  const undoStackRef = useRef<string[]>([]);
  const redoStackRef = useRef<string[]>([]);
  const maxUndoStack = 50;

  // 초기화
  useEffect(() => {
    if (editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent;
      updateWordCount();
      saveState();
    }
  }, [initialContent]);

  // 텍스트 서식 적용
  const formatText = (command: string) => {
    document.execCommand(command, false, undefined);
    updateToolbarState();
    handleContentChange();
    saveState();
  };

  // 정렬 적용
  const alignText = (alignment: string) => {
    const alignments: { [key: string]: string } = {
      'left': 'justifyLeft',
      'center': 'justifyCenter',
      'right': 'justifyRight'
    };
    document.execCommand(alignments[alignment], false, undefined);
    handleContentChange();
    saveState();
  };

  // 사전 정의된 스타일 적용
  const applyStyle = (className: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      if (!range.collapsed) {
        const div = document.createElement('div');
        div.className = className;
        
        try {
          range.surroundContents(div);
        } catch (e) {
          const contents = range.extractContents();
          div.appendChild(contents);
          range.insertNode(div);
        }
      } else {
        const div = document.createElement('div');
        div.className = className;
        div.innerHTML = '여기에 입력하세요';
        range.insertNode(div);
        
        range.selectNodeContents(div);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    handleContentChange();
    saveState();
  };

  // 양식 밑줄 삽입
  const insertFormLine = () => {
    const hr = document.createElement('hr');
    hr.className = 'form-line';
    hr.style.cssText = 'border: none; border-bottom: 1px solid #d1d5db; margin: 0.5rem 0 1rem 0; height: 1.5rem; display: block;';
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.insertNode(hr);
      
      range.setStartAfter(hr);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    handleContentChange();
    saveState();
  };

  // 목록 토글
  const toggleList = (type: string) => {
    const command = type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
    document.execCommand(command, false, undefined);
    updateToolbarState();
    handleContentChange();
    saveState();
  };

  // 실행취소/다시실행
  const undoRedo = (action: string) => {
    if (action === 'undo' && undoStackRef.current.length > 1) {
      const currentState = undoStackRef.current.pop();
      if (currentState) {
        redoStackRef.current.push(currentState);
      }
      const previousState = undoStackRef.current[undoStackRef.current.length - 1];
      if (editorRef.current && previousState) {
        editorRef.current.innerHTML = previousState;
      }
    } else if (action === 'redo' && redoStackRef.current.length > 0) {
      const nextState = redoStackRef.current.pop();
      if (nextState) {
        undoStackRef.current.push(nextState);
        if (editorRef.current) {
          editorRef.current.innerHTML = nextState;
        }
      }
    }
    handleContentChange();
    updateWordCount();
  };

  // 상태 저장
  const saveState = () => {
    if (editorRef.current) {
      const currentState = editorRef.current.innerHTML;
      undoStackRef.current.push(currentState);
      
      if (undoStackRef.current.length > maxUndoStack) {
        undoStackRef.current.shift();
      }
      redoStackRef.current = [];
    }
  };

  // 툴바 상태 업데이트
  const updateToolbarState = () => {
    // 이 함수는 버튼 상태를 업데이트하는 데 사용됩니다
    // React에서는 state로 관리할 수 있습니다
  };

  // 내용 변경 처리
  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onContentChange(content);
      updateWordCount();
    }
  };

  // 워드 카운트 업데이트
  const updateWordCount = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText;
      const count = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      setWordCount(count);
    }
  };

  // 저장 시뮬레이션
  const saveDocument = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      console.log('저장된 내용:', content);
      
      const now = new Date();
      setLastSaved(now.toLocaleTimeString());
      
      // 실제 구현에서는 여기서 서버로 전송
      alert('문서가 저장되었습니다!');
    }
  };

  // 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'b':
            e.preventDefault();
            formatText('bold');
            break;
          case 'i':
            e.preventDefault();
            formatText('italic');
            break;
          case 'u':
            e.preventDefault();
            formatText('underline');
            break;
          case 's':
            e.preventDefault();
            saveDocument();
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              undoRedo('redo');
            } else {
              undoRedo('undo');
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* 내장 스타일 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* 신고서 제목 스타일 */
          .report-title {
            font-size: 3rem !important;
            font-weight: 800 !important;
            color: #2563eb !important;
            text-align: center !important;
            margin: 1rem 0 !important;
            line-height: 1.2 !important;
            letter-spacing: 0.1em !important;
          }

          /* 부제목 스타일 */
          .report-subtitle {
            text-align: center !important;
            color: #4b5563 !important;
            font-size: 1.125rem !important;
            margin: 0.5rem 0 2rem 0 !important;
          }

          /* 양식 라벨 스타일 */
          .form-label {
            font-weight: 600 !important;
            color: #374151 !important;
            display: block !important;
            margin: 1rem 0 0.25rem 0 !important;
          }

          /* 우측 정렬 (날짜) */
          .date-right {
            text-align: right !important;
            font-size: 0.875rem !important;
            color: #6b7280 !important;
            margin: 0.5rem 0 !important;
          }

          /* 양식 밑줄 */
          .form-line {
            border: none !important;
            border-bottom: 1px solid #d1d5db !important;
            margin: 0.5rem 0 1rem 0 !important;
            height: 1.5rem !important;
            display: block !important;
          }

          /* 일반 문단 */
          .editor-content p {
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 0.5rem;
            color: #1f2937;
          }

          /* 목록 스타일 */
          .editor-content ul,
          .editor-content ol {
            margin-left: 1.5rem;
            margin-bottom: 1rem;
          }

          .editor-content li {
            margin-bottom: 0.25rem;
          }

          /* ContentEditable 포커스 스타일 */
          [contenteditable="true"]:focus {
            outline: none;
            box-shadow: inset 0 0 0 2px #3b82f6;
            border-radius: 4px;
          }

          /* 선택된 텍스트 하이라이트 */
          ::selection {
            background-color: #dbeafe;
            color: #1e40af;
          }

          ::-moz-selection {
            background-color: #dbeafe;
            color: #1e40af;
          }
        `
      }} />

      {/* 툴바 */}
      {!isReadOnly && (
        <div className="border-b p-3 bg-gray-50 flex flex-wrap gap-2 items-center">
          {/* 기본 서식 */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <button
              onClick={() => formatText('bold')}
              className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => formatText('italic')}
              className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <em>I</em>
            </button>
            <button
              onClick={() => formatText('underline')}
              className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <u>U</u>
            </button>
          </div>

          {/* 사전 정의된 스타일 */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <button
              onClick={() => applyStyle('report-title')}
              className="px-3 py-1 text-sm rounded bg-blue-100 hover:bg-blue-200 text-blue-800"
            >
              신고서 제목
            </button>
            <button
              onClick={() => applyStyle('report-subtitle')}
              className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              부제목
            </button>
            <button
              onClick={() => applyStyle('form-label')}
              className="px-3 py-1 text-sm rounded bg-green-100 hover:bg-green-200 text-green-800"
            >
              양식 라벨
            </button>
          </div>

          {/* 정렬 */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <button
              onClick={() => alignText('left')}
              className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
            >
              ←
            </button>
            <button
              onClick={() => alignText('center')}
              className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
            >
              ↔
            </button>
            <button
              onClick={() => applyStyle('date-right')}
              className="px-3 py-1 text-sm rounded bg-purple-100 hover:bg-purple-200 text-purple-800"
            >
              날짜 우측
            </button>
          </div>

          {/* 특수 요소 */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <button
              onClick={insertFormLine}
              className="px-3 py-1 text-sm rounded bg-orange-100 hover:bg-orange-200 text-orange-800"
            >
              양식 밑줄
            </button>
            <button
              onClick={() => toggleList('ul')}
              className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
            >
              • 목록
            </button>
            <button
              onClick={() => toggleList('ol')}
              className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
            >
              1. 번호목록
            </button>
          </div>

          {/* 실행취소/다시실행 */}
          <div className="flex gap-1">
            <button
              onClick={() => undoRedo('undo')}
              className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
              disabled={undoStackRef.current.length <= 1}
            >
              ↶
            </button>
            <button
              onClick={() => undoRedo('redo')}
              className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
              disabled={redoStackRef.current.length === 0}
            >
              ↷
            </button>
          </div>
        </div>
      )}

      {/* 에디터 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div 
          ref={editorRef}
          className="editor-content min-h-[500px] p-8 outline-none"
          contentEditable={!isReadOnly}
          onInput={handleContentChange}
          onKeyUp={updateToolbarState}
          onMouseUp={updateToolbarState}
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
          }}
        />
      </div>

      {/* 하단 상태바 */}
      <div className="border-t p-2 bg-gray-50 text-sm text-gray-600 flex justify-between">
        <span>워드 카운트: {wordCount}개</span>
        <span>마지막 저장: {lastSaved}</span>
      </div>
    </div>
  );
};

export default TextEditor;