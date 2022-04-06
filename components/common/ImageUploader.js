import {FilePond, registerPlugin} from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import React, {useEffect, useState} from "react";

registerPlugin(FilePondPluginImagePreview);

export default function ImageUploader({
                                          defaultFileUrl,
                                          getUrl,
                                          id,
                                          required = false,
                                          title = 'Drag & Drop your files'
                                      }) {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (defaultFileUrl) {
            /*let source = defaultFileUrl.replace('https://res.cloudinary.com/arouzex/image/upload/', '');*/
            let defaultUrl = [
                {
                    source: defaultFileUrl,
                    options: {
                        type: 'local'
                    }
                }
            ];
            setFiles(defaultUrl);
        }
    }, [defaultFileUrl])

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
                load: {
                    url: '/public/uploads'
                }
            }}
            name="file"
            labelIdle={`${title} or <span class="filepond--label-action">Browse</span>`}
        />
    )
}
