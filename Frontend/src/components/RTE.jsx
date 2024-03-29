import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';
import { useSelector } from "react-redux";
export default function RTE({ name, control, label, defaultValue = "" }) {
  const theme = useSelector((state) => state.theme.mode);
  let mainClassName = 'block text-gray-700 text-sm font-bold mb-4';

  if (theme === 'dark') {
    mainClassName = 'dark:text-white block text-sm font-bold mb-4';
  }
  return (
    <div className='w-full'>
      {label && <label className={mainClassName}>{label}</label>}

      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            apiKey="y1ndjfjlpnwqefssy5wi9tktp5tvgkvmwqhpwo6zr9cz2ql8"
            initialValue={defaultValue}
            init={{
              initialValue: defaultValue,
              height: 500,
              menubar: true,
              plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "anchor",
              ],
              toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
              content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
            }}
            onEditorChange={onChange}
          />
        )}
      />

    </div>
  )
}
