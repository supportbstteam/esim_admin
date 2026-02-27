"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Italic,
  Essentials,
  Paragraph,
  Heading,
  List,
  SourceEditing, // Feature: Write HTML
  Image,
  ImageInsert, // Feature: Add image via URL
  ImageResize, // Feature: Change width/height
  ImageToolbar,
  GeneralHtmlSupport // Ensures custom HTML isn't deleted
} from "ckeditor5";

import "ckeditor5/ckeditor5.css"; // Required for UI to appear

interface Props {
  value: string;
  onChange: (data: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value || ""}
      config={{
        licenseKey: 'GPL', // Required for version 44+
        plugins: [
          Essentials, Bold, Italic, Paragraph, Heading, List,
          SourceEditing, Image, ImageInsert, ImageResize, ImageToolbar, GeneralHtmlSupport
        ],
        toolbar: [
          "sourceEditing", "|", // The "Source Code" button
          "heading", "|",
          "bold", "italic", "|",
          "bulletedList", "numberedList", "|",
          "insertImage", "|", // The "Add Image URL" button
          "undo", "redo",
        ],
        htmlSupport: {
          allow: [{ name: /.*/, attributes: true, classes: true, styles: true }]
        },
        image: {
          toolbar: [
            "imageTextAlternative", "|",
            "resizeImage:original", "resizeImage:25", "resizeImage:50", "resizeImage:75"
          ]
        }
      }}
      onChange={(_, editor) => onChange(editor.getData())}
    />
  );
}
