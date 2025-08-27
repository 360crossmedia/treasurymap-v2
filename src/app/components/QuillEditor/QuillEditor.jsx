import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function QuillEditor({
  value,
  onChange,
  modules,
  formats,
  className,
}) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      // Inicializar Quill
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules,
        formats,
      });

      // Valor inicial
      quillRef.current.root.innerHTML = value || "";

      // Detectar cambios
      quillRef.current.on("text-change", () => {
        if (quillRef.current) {
          onChange(quillRef.current.root.innerHTML);
        }
      });
    }
  }, []);

  // Si cambia "value" desde fuera, actualizar contenido
  useEffect(() => {
    if (quillRef.current && quillRef.current.root.innerHTML !== value) {
      quillRef.current.root.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div className={className} ref={editorRef} style={{ minHeight: "200px" }} />
  );
}
