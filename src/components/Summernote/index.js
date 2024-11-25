import React, { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import styles from './Summernote.module.scss';

const cx = classNames.bind(styles);

const CKEditorWrapper = ({ content, setContent }) => {
    const editorRef = useRef();

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            const editorElement = editorRef.current.querySelector('.ck-editor__editable');
            if (editorElement) {
                editorElement.style.height = 'auto';
                editorElement.style.overflowY = 'hidden';
            }
        });

        observer.observe(editorRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={editorRef}>
            <CKEditor
                editor={ClassicEditor}
                data={content}
                config={{
                    toolbar: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        '|',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'blockQuote',
                        '|',
                        'insertTable',
                        '|',
                        'undo',
                        'redo',
                    ],
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setContent(data);
                }}
            />
        </div>
    );
};

export default CKEditorWrapper;
