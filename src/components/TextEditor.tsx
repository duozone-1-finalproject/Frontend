// src/components/TextEditor.tsx
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Editor } from '@tiptap/core';

// 에디터 메뉴 바 컴포넌트 (선택 사항이지만, 보통 필요함)
interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap p-2 border-b border-gray-300 bg-gray-100">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active p-1 m-1 bg-blue-200 rounded' : 'p-1 m-1 bg-gray-200 rounded'}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active p-1 m-1 bg-blue-200 rounded' : 'p-1 m-1 bg-200 rounded'}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active p-1 m-1 bg-blue-200 rounded' : 'p-1 m-1 bg-gray-200 rounded'}
      >
        Strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active p-1 m-1 bg-blue-200 rounded' : 'p-1 m-1 bg-gray-200 rounded'}
      >
        Code
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active p-1 m-1 bg-blue-200 rounded' : 'p-1 m-1 bg-gray-200 rounded'}
      >
        Paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active p-1 m-1 bg-blue-200 rounded' : 'p-1 m-1 bg-gray-200 rounded'}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active p-1 m-1 bg-blue-200 rounded' : 'p-1 m-1 bg-gray-200 rounded'}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active p-1 m-1 bg-blue-200 rounded' : 'p-1 m-1 bg-gray-200 rounded'}
      >
        Bullet List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active p-1 m-1 bg-blue-200 rounded' : 'p-1 m-1 bg-gray-200 rounded'}
      >
        Ordered List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active p-1 m-1 bg-blue-200 rounded' : 'p-1 m-1 bg-gray-200 rounded'}
      >
        Code Block
      </button>
      <button
        onClick={() => editor.chain().focus().setBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active p-1 m-1 bg-blue-200 rounded' : 'p-1 m-1 bg-gray-200 rounded'}
      >
        Blockquote
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-1 m-1 bg-gray-200 rounded"
      >
        Horizontal Rule
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-1 m-1 bg-gray-200 rounded"
      >
        Undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-1 m-1 bg-gray-200 rounded"
      >
        Redo
      </button>
      <button
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        className="p-1 m-1 bg-gray-200 rounded"
      >
        Clear Format
      </button>
    </div>
  );
};


// 메인 에디터 컴포넌트
interface TextEditorProps {
  initialContent?: string; // HTML 형식의 초기 콘텐츠
  onContentChange: (html: string) => void; // 콘텐츠 변경 시 호출될 콜백
}

const TextEditor: React.FC<TextEditorProps> = ({ initialContent, onContentChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit, // 기본 확장 기능 (볼드, 이탤릭, 단락, 제목 등 포함)
      // 필요에 따라 추가 확장 기능들을 여기에 넣습니다.
      // 예를 들어, Table.configure({ resizable: true }), Image.configure({ inline: true }),
    ],
    content: initialContent || '<p>여기에 보고서 내용을 입력하세요...</p>',
    onUpdate: ({ editor }) => {
      // 에디터 내용이 변경될 때마다 HTML을 부모 컴포넌트로 전달
      onContentChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none p-4 min-h-[400px] border border-gray-300 rounded bg-white',
      },
    },
  });

  return (
    <div className="editor-container border rounded shadow-md overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
};

export default TextEditor;