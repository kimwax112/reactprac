import React from "react";

import ReactQuill from "react-quill";

function Write() {
  const modules = {
    toolbar: {
      container: [
        ["image"],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link"],
      ],
    },
  };
  return (
    <>
      <ReactQuill
        style={{ width: "800px", height: "600px" }}
        modules={modules}
      />
    </>
  );
}
export default Write;
