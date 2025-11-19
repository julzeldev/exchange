'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Box, Paper, IconButton, Divider, Tooltip } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import LinkIcon from '@mui/icons-material/Link';
import { useEffect, useCallback } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor?.chain().focus().toggleUnderline().run();
  }, [editor]);

  const setAlignLeft = useCallback(() => {
    editor?.chain().focus().setTextAlign('left').run();
  }, [editor]);

  const setAlignCenter = useCallback(() => {
    editor?.chain().focus().setTextAlign('center').run();
  }, [editor]);

  const setAlignRight = useCallback(() => {
    editor?.chain().focus().setTextAlign('right').run();
  }, [editor]);

  const setAlignJustify = useCallback(() => {
    editor?.chain().focus().setTextAlign('justify').run();
  }, [editor]);

  const setLink = useCallback(() => {
    const url = window.prompt('URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    editor?.chain().focus().setColor(e.target.value).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          p: 1,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.default',
        }}
      >
        <Tooltip title="Negrita">
          <IconButton
            size="small"
            onClick={toggleBold}
            color={editor.isActive('bold') ? 'primary' : 'default'}
            aria-label="Negrita"
          >
            <FormatBoldIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Cursiva">
          <IconButton
            size="small"
            onClick={toggleItalic}
            color={editor.isActive('italic') ? 'primary' : 'default'}
            aria-label="Cursiva"
          >
            <FormatItalicIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Subrayado">
          <IconButton
            size="small"
            onClick={toggleUnderline}
            color={editor.isActive('underline') ? 'primary' : 'default'}
            aria-label="Subrayado"
          >
            <FormatUnderlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Tooltip title="Alinear izquierda">
          <IconButton
            size="small"
            onClick={setAlignLeft}
            color={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}
            aria-label="Alinear izquierda"
          >
            <FormatAlignLeftIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Centrar">
          <IconButton
            size="small"
            onClick={setAlignCenter}
            color={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}
            aria-label="Centrar"
          >
            <FormatAlignCenterIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Alinear derecha">
          <IconButton
            size="small"
            onClick={setAlignRight}
            color={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}
            aria-label="Alinear derecha"
          >
            <FormatAlignRightIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Justificar">
          <IconButton
            size="small"
            onClick={setAlignJustify}
            color={editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'}
            aria-label="Justificar"
          >
            <FormatAlignJustifyIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Tooltip title="Agregar enlace">
          <IconButton
            size="small"
            onClick={setLink}
            color={editor.isActive('link') ? 'primary' : 'default'}
            aria-label="Agregar enlace"
          >
            <LinkIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <input
          type="color"
          onChange={handleColorChange}
          value={editor.getAttributes('textStyle').color || '#000000'}
          style={{
            width: '32px',
            height: '32px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '4px',
          }}
          title="Color de texto"
        />
      </Box>

      <Box
        sx={{
          minHeight: 300,
          maxHeight: 500,
          overflowY: 'auto',
          '& .ProseMirror': {
            minHeight: 300,
            padding: 2,
            outline: 'none',
            fontFamily: 'var(--font-lora)',
            '& p': {
              marginBottom: 1,
            },
            '& p:last-child': {
              marginBottom: 0,
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );
}
