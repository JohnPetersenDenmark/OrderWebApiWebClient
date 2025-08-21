// CustomQuillEditor.tsx
import React, { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css"; // keep Quill's base styling

const toolbarContainerStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap", // ⬅️ allows multiple lines
  gap: "6px",
  alignItems: "center",
  padding: "6px",
  borderBottom: "1px solid #e5e7eb",
  background: "#fafafa",
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
};

// optional: make the editor itself compact
const editorWrapperStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  overflow: "hidden",
};

const icons = Quill.import("ui/icons");
icons["underline"] = "U";    // replace U with Fed
icons["bold"] = "F";         // replace B with Fed (optional)
icons["italic"] = "K";    // replace I with Kursiv (optional)


// You can keep this minimal; include only formats you actually use
/* const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
"link",
  "image",
  "color",
  "background",
  "align",
  "clean",
]; */

interface CustomQuillEditorProps {
  initialValue?: string;
  onChange?: (html: string) => void;
}

const CustomQuillEditor: React.FC<CustomQuillEditorProps> = ({ initialValue, onChange}) => {
 

  const [value, setValue] = useState<string>(initialValue ?? "");

  const handleChange = (html: string) => {
    setValue(html);
    onChange?.(html);
  };

  return (
    <div>
      {/* Inline CSS tweaks that target Quill classes (scoped by this component) */}
      <style>{`
        .ql-toolbar.ql-snow { /* already flex from our inline container, but style buttons */
          padding: 0; /* we handle padding in our container */
        }
        /* Make buttons/selects a bit smaller for dialogs */
        .ql-toolbar button, .ql-toolbar .ql-picker {
          height: 28px;
        }
        .ql-toolbar .ql-picker-label,
        .ql-toolbar .ql-picker-item {
          line-height: 28px;
        }
        /* Tighter spacing between groups, we also have gap inline */
        .ql-toolbar .ql-formats { margin-right: 0; }
        /* Editor area height */
        .ql-container { min-height: 180px; }
        /* Responsive images in content */
        .ql-editor img { max-width: 100%; height: auto; }
      `}</style>

      {/* Custom toolbar DOM — full control over layout */}
      <div id="da-toolbar" style={toolbarContainerStyle}>
        {/* Row 1 groups */}
        <span className="ql-formats">
          <button className="ql-bold" aria-label="Fed" />
          <button className="ql-italic" aria-label="Kursiv" />
          <button className="ql-underline" aria-label="Understreg" />
          <button className="ql-strike" aria-label="Gennemstreg" />
        </span>

        <span className="ql-formats">
          {/* Heading dropdown: default/normal, H1, H2, H3 */}
          <select className="ql-header" defaultValue="">
            <option value="">Brødtekst</option>
            <option value="1">Overskrift 1</option>
            <option value="2">Overskrift 2</option>
            <option value="3">Overskrift 3</option>
          </select>
        </span>

        <span className="ql-formats">
          <button className="ql-list" value="ordered" aria-label="Nummereret liste" />
          <button className="ql-list" value="bullet" aria-label="Punktliste" />
        </span>

        {/* Row 2 groups (they’ll wrap thanks to flexWrap) */}
        <span className="ql-formats">
          <button className="ql-link" aria-label="Link" />
          <button className="ql-image" aria-label="Billede" />
        </span>

        <span className="ql-formats">
          <select className="ql-color" aria-label="Tekstfarve" />
          <select className="ql-background" aria-label="Baggrundsfarve" />
        </span>

        <span className="ql-formats">
          <select className="ql-align" aria-label="Justering" />
        </span>

        <span className="ql-formats">
          <button className="ql-clean" aria-label="Ryd formatering" />
        </span>
      </div>

      {/* Editor */}
      <div style={editorWrapperStyle}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={handleChange}
          // formats={formats}
          modules={{
            toolbar: { container: "#da-toolbar" }, // ⬅️ bind to our custom toolbar
            history: { delay: 400, maxStack: 100, userOnly: true },
            clipboard: { matchVisual: false },
          }}
        />
      </div>

      {/* Optional: live HTML preview */}
      <div style={{ marginTop: 12 }}>
        <strong>Preview (HTML):</strong>
        <div
          style={{
            border: "1px solid #eee",
            padding: 12,
            borderRadius: 8,
            minHeight: 80,
            marginTop: 6,
          }}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </div>
    </div>
  );
}

export default CustomQuillEditor
