import React, {useEffect, useState} from 'react';
import {Editor as TinymceEditor} from '@tinymce/tinymce-react';
import {
    FormControl,
    FormHelperText,
    InputLabel,
    TextField,
} from '@mui/material';
import {debounce} from 'lodash';

/**
 //Basic uses of TextEditor
 const textEditorRef = useRef<any>(null);

 <TextEditor
 ref={textEditorRef}
 errorInstance={errors}
 label={messages['common.description']}
 />
 />
 */
const OnlineEditor = React.forwardRef(({
                                           value,
                                           height,
                                           onEditorChange,
                                           id,
                                           required = false,
                                           label,
                                           register,
                                           setValue,
                                       },
                                       ref,
    ) => {
        const [initialValue, setInitialValue] = useState('');
        useEffect(() => {
            setInitialValue(value);
        }, [value])

        const onActivateUI = () => {
            // @ts-ignore
            const tinyMCE = window.tinyMCE;

            if (tinyMCE) {
                tinyMCE.activeEditor.windowManager.open = (
                    (open) =>
                        (...args) => {
                            let op = open(...args);
                            let dialog =
                                document.getElementsByClassName('tox-tinymce-aux')?.[0];
                            let target = document.getElementsByClassName(
                                'MuiDialog-container',
                            )?.[0];

                            if (target && dialog) {
                                target.appendChild(dialog);
                            }
                            return op;
                        }
                )(tinyMCE.activeEditor.windowManager.open);
            }
        };

        let toolbar =
            'undo redo formatselect bold italic underline | alignleft aligncenter alignright alignjustify | image media template link';
        return (
            <>
                <InputLabel required={required}>{label}</InputLabel>
                <FormControl fullWidth>
                    <TinymceEditor
                        onInit={onActivateUI}
                        id={id}
                        onEditorChange={debounce((content) => {
                            setValue(id, content);
                        }, 500)}
                        ref={ref}
                        initialValue={initialValue}
                        init={{
                            height: height ? height : 700,
                            menubar: false,
                            branding: false,
                            convert_urls: false,
                            // images_upload_handler: tinyMceEditorImageUploader,
                            fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
                            plugins: [
                                'advlist autolink lists link image charmap print preview anchor template linkchecker ',
                                'searchreplace visualblocks code image fullscreen',
                                'insertdatetime media table paste code help wordcount',
                            ],
                            toolbar,
                            toolbar_mode: 'wrap',
                            setup: function (editor) {
                                editor.on('init', function (e) {
                                    console.log('e', e);
                                });
                                editor.on('focus', function () {
                                    console.log('focused');
                                });
                                editor.on('blur', function () {
                                    console.log('blurred');
                                });
                            },
                            templates: [
                                /* {
                                  title: 'about us component',
                                  description: 'create about us',
                                  content:
                                    '<div style="margin: 10px 30px">' +
                                    '<div class="row" style="box-sizing: border-box; width: 100%">' +
                                    '<div class="column" style="float: left; width: 50%; max-height: 300px;">' +
                                    'content</div>' +
                                    '<div class="column" style="float: left; width: 50%; max-height: 300px">image</div>' +
                                    '</div>' +
                                    '<div class="row" style="box-sizing: border-box; width:100%;">' +
                                    '<div class="column" style="float: left; width: 50%; max-height: 300px;">' +
                                    'content</div>' +
                                    '<div class="column" style="float: left; width: 50%; max-height: 300px">image</div>' +
                                    '</div>' +
                                    '<div class="row" style="box-sizing: border-box; width:100%;">' +
                                    '<div class="column" style="float: left; width: 50%; max-height: 300px;">' +
                                    'content</div>' +
                                    '<div class="column" style="float: left; width: 50%; max-height: 300px">image</div>' +
                                    '</div>' +
                                    '</div>',
                                },*/

                                {
                                    title: 'Two column table',
                                    description: 'Creates a new table',
                                    content:
                                        '<div class="editor-template-table">' +
                                        '<table width="100%"  border="0">' +
                                        '<tr><td colspan="6">Content</td><td colspan="6">Content</td></tr>' +
                                        '</table>' +
                                        '</div>',
                                },
                                {
                                    title: 'Link Button',
                                    description: 'Creates a new button',
                                    content:
                                        '<div >' +
                                        '<a class="link-button MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButtonBase-root" style="border-radius: 5px; border: 1px solid #bfbfbf; padding: 5px 10px 8px; text-decoration: none; color: #1c1c1c;" href="#" title="">' +
                                        'Button Text' +
                                        '<span class="MuiButton-startIcon MuiButton-iconSizeMedium css-1d6wzja-MuiButton-startIcon"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" data-testid="DashboardIcon"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path></svg></span>' +
                                        '</a>' +
                                        '</div>',
                                },
                            ],
                            template_cdate_format:
                                '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
                            template_mdate_format:
                                '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
                        }}
                    />
                    <TextField
                        id={id}
                        type={'hidden'}
                        {...register(id)}
                        sx={{display: 'none'}}
                    />
                </FormControl>
            </>
        );
    },
);

export default OnlineEditor;
