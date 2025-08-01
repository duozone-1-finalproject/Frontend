// src/components/TextEditor.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';

interface TextEditorProps {
  initialContent: string;
  onContentChange: (html: string) => void;
  isReadOnly?: boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({
  initialContent,
  onContentChange,
  isReadOnly = false,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const textColors = [
    '#000000',
    '#374151',
    '#6B7280',
    '#EF4444',
    '#F59E0B',
    '#10B981',
    '#3B82F6',
    '#8B5CF6',
    '#EC4899',
    '#F97316',
  ];

  const highlightColors = [
    '#FEF3C7',
    '#DBEAFE',
    '#D1FAE5',
    '#FEE2E2',
    '#F3E8FF',
    '#FFEDD5',
    '#E0E7FF',
    '#FCE7F3',
    '#F0F9FF',
    '#F9FAFB',
  ];

  const memoizedOnContentChange = useCallback(
    (html: string) => {
      onContentChange(html);
    },
    [onContentChange]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent,
    editable: !isReadOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      memoizedOnContentChange(html);
    },
    editorProps: {
      attributes: {
        class:
          'editor-content min-h-[500px] p-8 outline-none prose prose-lg max-w-none',
        spellcheck: 'false',
      },
      handleKeyDown: (view, event) => {
          if (navigator.userAgent.includes('Mac') && event.key === 'Dead') {
              return true;
          }
          return false;
      },
    },
  });

  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">에디터 로딩 중...</div>
    );
  }

  const ToolbarButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
  }> = ({ onClick, isActive = false, disabled = false, className = '', children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 text-sm rounded transition-colors ${
        isActive
          ? 'bg-blue-200 text-blue-800'
          : disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
      } ${className}`}
    >
      {children}
    </button>
  );
  
  const loadLeftContent = () => {
    const leftFormattedContent = `
      <h1 style="text-align: center; font-size: 3rem; font-weight: 800; color: #2563eb; margin: 1rem 0; letter-spacing: 0.1em;">증 권 신 고 서</h1>
      <h2 style="text-align: center; color: #4b5563; font-size: 1.125rem; margin: 0.5rem 0 2rem 0;">( 지 분 증 권 )</h2>
      <br>
      <p><strong>금융위원회 귀중</strong></p>
      <p style="text-align: right; font-size: 0.875rem; color: #6b7280; margin: 0.5rem 0;">2022년 08월 16일</p>
      <br>
      <p style="font-weight: 600; color: #374151; margin: 1rem 0 0.25rem 0;"><strong>회 사 명:</strong></p>
      <hr style="border: none; border-bottom: 1px solid #d1d5db; margin: 0.5rem 0 1rem 0; height: 1.5rem;">
      <p style="font-weight: 600; color: #374151; margin: 1rem 0 0.25rem 0;"><strong>대 표 이 사:</strong></p>
      <hr style="border: none; border-bottom: 1px solid #d1d5db; margin: 0.5rem 0 1rem 0; height: 1.5rem;">
      <p style="font-weight: 600; color: #374151; margin: 1rem 0 0.25rem 0;"><strong>본 점 소 재 지:</strong></p>
      <hr style="border: none; border-bottom: 1px solid #d1d5db; margin: 0.5rem 0 1rem 0; height: 1.5rem;">
      <br>
      <p style="font-weight: 600; color: #374151; margin: 1rem 0 0.25rem 0;"><strong>작 성 책 임 자:</strong></p>
      <hr style="border: none; border-bottom: 1px solid #d1d5db; margin: 0.5rem 0 1rem 0; height: 1.5rem;">
      <br>
      <p style="font-weight: 600; color: #374151; margin: 1rem 0 0.25rem 0;"><strong>모집 또는 매출 증권의 종류 및 수:</strong></p>
      <hr style="border: none; border-bottom: 1px solid #d1d5db; margin: 0.5rem 0 1rem 0; height: 1.5rem;">
      <br>
      <p>--------------------------------------------------</p>
      <p>이 부분부터는 자유롭게 편집할 수 있습니다.</p>
    `;
    editor.commands.setContent(leftFormattedContent);
  };
  
  const applyReportTitle = () => {
    editor.chain().focus().toggleHeading({ level: 1 }).run();
    setTimeout(() => {
      const h1Elements = document.querySelectorAll('.ProseMirror h1');
      h1Elements.forEach((el) => {
        (
          el as HTMLElement
        ).style.cssText =
          'text-align: center; font-size: 3rem; font-weight: 800; color: #2563eb; margin: 1rem 0; letter-spacing: 0.1em;';
      });
    }, 100);
  };
  
  const applyReportSubtitle = () => {
    editor.chain().focus().toggleHeading({ level: 2 }).run();
    setTimeout(() => {
      const h2Elements = document.querySelectorAll('.ProseMirror h2');
      h2Elements.forEach((el) => {
        (
          el as HTMLElement
        ).style.cssText =
          'text-align: center; color: #4b5563; font-size: 1.125rem; margin: 0.5rem 0 2rem 0;';
      });
    }, 100);
  };
  
  const applyFormLabel = () => {
    editor.chain().focus().setParagraph().run();
    setTimeout(() => {
      const selection = editor.state.selection;
      if (selection) {
        const pElements = document.querySelectorAll('.ProseMirror p');
        pElements.forEach((el) => {
          if (el.textContent && selection.from >= 0) {
            (
              el as HTMLElement
            ).style.cssText =
              'font-weight: 600; color: #374151; margin: 1rem 0 0.25rem 0;';
          }
        });
      }
    }, 100);
  };
  
  const insertFormLine = () => {
    editor.chain().focus().setHorizontalRule().run();
    setTimeout(() => {
      const hrElements = document.querySelectorAll('.ProseMirror hr');
      hrElements.forEach((el) => {
        (
          el as HTMLElement
        ).style.cssText =
          'border: none; border-bottom: 1px solid #d1d5db; margin: 0.5rem 0 1rem 0; height: 1.5rem;';
      });
    }, 100);
  };
  
  const applyDateRight = () => {
    editor.chain().focus().setParagraph().setTextAlign('right').run();
    setTimeout(() => {
      const pElements = document.querySelectorAll(
        '.ProseMirror p[style*="text-align: right"]'
      );
      pElements.forEach((el) => {
        (el as HTMLElement).style.cssText +=
          ' font-size: 0.875rem; color: #6b7280; margin: 0.5rem 0;';
      });
    }, 100);
  };
  
  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };
  
  const addColumnBefore = () => {
    editor.chain().focus().addColumnBefore().run();
  };
  
  const addColumnAfter = () => {
    editor.chain().focus().addColumnAfter().run();
  };
  
  const deleteColumn = () => {
    editor.chain().focus().deleteColumn().run();
  };
  
  const addRowBefore = () => {
    editor.chain().focus().addRowBefore().run();
  };
  
  const addRowAfter = () => {
    editor.chain().focus().addRowAfter().run();
  };
  
  const deleteRow = () => {
    editor.chain().focus().deleteRow().run();
  };
  
  const deleteTable = () => {
    editor.chain().focus().deleteTable().run();
  };
  
  const mergeCells = () => {
    editor.chain().focus().mergeCells().run();
  };
  
  const splitCell = () => {
    editor.chain().focus().splitCell().run();
  };
  
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* 일반 문단 */
          .editor-content p,
          .ProseMirror p {
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 0.5rem;
            color: #1f2937;
          }

          /* 제목들 */
          .ProseMirror h1 { 
            font-size: 2rem; 
            font-weight: bold; 
            margin: 1rem 0;
          }
          .ProseMirror h2 { 
            font-size: 1.5rem; 
            font-weight: bold; 
            margin: 1rem 0;
          }
          .ProseMirror h3 { 
            font-size: 1.25rem; 
            font-weight: bold; 
            margin: 1rem 0;
          }

          /* 목록 스타일 */
          .editor-content ul,
          .editor-content ol,
          .ProseMirror ul,
          .ProseMirror ol {
            margin-left: 1.5rem;
            margin-bottom: 1rem;
          }

          .editor-content li,
          .ProseMirror li {
            margin-bottom: 0.25rem;
          }

          /* 표 스타일 */
          .ProseMirror table {
            border-collapse: collapse;
            margin: 1rem 0;
            width: 100%;
          }

          .ProseMirror th,
          .ProseMirror td {
            border: 1px solid #d1d5db;
            padding: 0.5rem 1rem;
            text-align: left;
            vertical-align: top;
          }

          .ProseMirror th {
            background-color: #f9fafb;
            font-weight: 600;
          }

          .ProseMirror .selectedCell {
            background-color: #dbeafe;
          }

          /* TipTap 포커스 스타일 */
          .ProseMirror:focus {
            outline: none !important;
          }

          /* 선택된 텍스트 하이라이트 */
          .ProseMirror ::selection {
            background-color: #dbeafe;
            color: #1e40af;
          }

          .ProseMirror ::-moz-selection {
            background-color: #dbeafe;
            color: #1e40af;
          }

          /* 빈 문단 플레이스홀더 */
          .ProseMirror p.is-editor-empty:first-child::before {
            color: #adb5bd;
            content: "여기에 내용을 입력하세요...";
            float: left;
            height: 0;
            pointer-events: none;
          }

          /* 수평선 스타일 */
          .ProseMirror hr {
            border: none;
            border-bottom: 1px solid #e5e7eb;
            margin: 2rem 0;
          }

          /* 색상 픽커 스타일 */
          .color-picker {
            position: absolute;
            z-index: 1000;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 0.75rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 0.25rem;
            width: 200px;
          }

          .color-option {
            width: 30px;
            height: 30px;
            border-radius: 0.25rem;
            border: 2px solid #e5e7eb;
            cursor: pointer;
            transition: all 0.2s;
          }

          .color-option:hover {
            transform: scale(1.1);
            border-color: #3b82f6;
          }
        `,
        }}
      />

      {/* 툴바 */}
      {!isReadOnly && (
        <div className="border-b p-3 bg-gray-50 flex flex-wrap gap-2 items-center">
          {/* 왼쪽 내용 불러오기 버튼 */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <ToolbarButton
              onClick={loadLeftContent}
              className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold"
            >
              ← 왼쪽 양식 불러오기
            </ToolbarButton>
          </div>

          {/* 기본 서식 */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
            >
              <strong>B</strong>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
            >
              <em>I</em>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
            >
              <u>U</u>
            </ToolbarButton>
          </div>

          {/* 색상 기능 */}
          <div className="flex gap-1 border-r pr-2 mr-2 relative">
            <div className="relative">
              <ToolbarButton
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowHighlightPicker(false);
                }}
                className="bg-red-100 hover:bg-red-200 text-red-800"
              >
                글자색
              </ToolbarButton>
              {showColorPicker && (
                <div className="color-picker mt-2">
                  {textColors.map((color) => (
                    <button
                      key={color}
                      className="color-option"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                        setShowColorPicker(false);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <ToolbarButton
                onClick={() => {
                  setShowHighlightPicker(!showHighlightPicker);
                  setShowColorPicker(false);
                }}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
              >
                배경색
              </ToolbarButton>
              {showHighlightPicker && (
                <div className="color-picker mt-2">
                  {highlightColors.map((color) => (
                    <button
                      key={color}
                      className="color-option"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        editor.chain().focus().setHighlight({ color }).run();
                        setShowHighlightPicker(false);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 제목 스타일 */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <ToolbarButton
              onClick={applyReportTitle}
              isActive={editor.isActive('heading', { level: 1 })}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800"
            >
              신고서 제목
            </ToolbarButton>
            <ToolbarButton
              onClick={applyReportSubtitle}
              isActive={editor.isActive('heading', { level: 2 })}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              부제목
            </ToolbarButton>
            <ToolbarButton
              onClick={applyFormLabel}
              isActive={false}
              className="bg-green-100 hover:bg-green-200 text-green-800"
            >
              양식 라벨
            </ToolbarButton>
          </div>

          {/* 정렬 */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
            >
              ←
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
            >
              ↔
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
            >
              →
            </ToolbarButton>
            <ToolbarButton
              onClick={applyDateRight}
              className="bg-purple-100 hover:bg-purple-200 text-purple-800"
            >
              날짜 우측
            </ToolbarButton>
          </div>

          {/* 표 기능 */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <ToolbarButton
              onClick={insertTable}
              className="bg-green-100 hover:bg-green-200 text-green-800"
            >
              표 삽입
            </ToolbarButton>
            {editor.isActive('table') && (
              <>
                <ToolbarButton onClick={addColumnBefore}>열←</ToolbarButton>
                <ToolbarButton onClick={addColumnAfter}>열→</ToolbarButton>
                <ToolbarButton onClick={deleteColumn}>열삭제</ToolbarButton>
                <ToolbarButton onClick={addRowBefore}>행↑</ToolbarButton>
                <ToolbarButton onClick={addRowAfter}>행↓</ToolbarButton>
                <ToolbarButton onClick={deleteRow}>행삭제</ToolbarButton>
                <ToolbarButton onClick={mergeCells}>셀병합</ToolbarButton>
                <ToolbarButton onClick={splitCell}>셀분할</ToolbarButton>
                <ToolbarButton
                  onClick={deleteTable}
                  className="bg-red-100 hover:bg-red-200 text-red-800"
                >
                  표삭제
                </ToolbarButton>
              </>
            )}
          </div>

          {/* 특수 요소 */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <ToolbarButton
              onClick={insertFormLine}
              className="bg-orange-100 hover:bg-orange-200 text-orange-800"
            >
              양식 밑줄
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
            >
              • 목록
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
            >
              1. 번호목록
            </ToolbarButton>
          </div>

          {/* 실행취소/다시실행 */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              ↶
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              ↷
            </ToolbarButton>
          </div>
        </div>
      )}

      {/* 에디터 영역 */}
      <div
        className="flex-1 overflow-y-auto"
        onClick={() => {
          setShowColorPicker(false);
          setShowHighlightPicker(false);
        }}
      >
        <EditorContent
          editor={editor}
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
          }}
        />
      </div>

      {/* 하단 상태바 */}
      <div className="border-t p-2 bg-gray-50 text-sm text-gray-600 flex justify-between">
        <span>문자 수: {editor.getText().length}개</span>
        <span>
          단어 수: {editor.getText().split(' ').filter((word) => word.length > 0).length}개
        </span>
      </div>
    </div>
  );
};

export default TextEditor;