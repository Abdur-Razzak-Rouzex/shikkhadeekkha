import {FilePond, registerPlugin} from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import React, {useState} from "react";

registerPlugin(FilePondPluginImagePreview);

export default function FilePondUploader({getUrl, id, required = false, title = 'Drag & Drop your files or'}) {
    const [files, setFiles] = useState([]);

    return (
        <FilePond
            required={required}
            id={id}
            files={files}
            onupdatefiles={setFiles}
            server={{
                process: {
                    url: "/api/upload",
                    onload: (response) => {
                        let res = JSON.parse(response);
                        getUrl(res?.secure_url)
                        return 1;
                    },
                },
            }}
            name="file"
            labelIdle={`${title} or <span class="filepond--label-action">Browse</span>`}
        />
    )
}
