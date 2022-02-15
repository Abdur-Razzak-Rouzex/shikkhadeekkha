import React, { useEffect, useState, useRef } from "react";

function CkEditor({getEditorData}) {
    let editorRef = useRef();
    const { CKEditor, ClassicEditor } = editorRef.current || {}; // if it don't find any document then it will be an empty object

    let [loaded, setLoaded] = useState(false);

    useEffect(() => {
        editorRef.current = {
            CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
            ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
        };

        setLoaded(true);
    }, []); // run on mounting

    if (loaded) {
        return (
            <CKEditor
                editor={ClassicEditor}
                data=""
                onReady={(editor) => {
                    // You can store the "editor" and use when it is needed.
                    console.log("Editor is ready to use!", editor);
                }}
                onChange={(event, editor) => {
                    // do something when editor's content changed
                    const data = editor.getData();
                    getEditorData(data)
                    console.log({ event, editor, data });
                }}
                onBlur={(event, editor) => {
                    console.log("Blur.", editor);
                }}
                onFocus={(event, editor) => {
                    console.log("Focus.", editor);
                }}
                config={{
                    placeholder: 'Start writing....'
                }}
            />
        );
    } else {
        return <h2> Editor is loading </h2>;
    }
}

export default CkEditor;