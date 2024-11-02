import React, { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import $ from 'jquery';
import 'summernote/dist/summernote.min.js';
import 'summernote/dist/summernote.css';
import styles from './Summernote.module.scss';

window.jQuery = $;
const cx = classNames.bind(styles);

const SummernoteEditor = ({ content, setContent }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        $(editorRef.current).summernote({
            height: 'auto',
            minHeight: 100,
            maxHeight: 200,
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['view', ['codeview', 'help']],
            ],
            callbacks: {
                onChange: (contents) => {
                    // Ghi nhớ nội dung trong Summernote nhưng không cập nhật ngay
                },
                onBlur: (event) => {
                    // Cập nhật nội dung khi mất focus
                    setTimeout(() => {
                        const contents = $(editorRef.current).summernote('code');
                        setContent(contents);
                    }, 0);
                },
            },
            code: content,
        });

        // Giữ focus khi khởi tạo
        setTimeout(() => {
            $(editorRef.current).summernote('focus');
        }, 0);

        return () => {
            $(editorRef.current).summernote('destroy');
        };
    }, [content, setContent]);

    return <div className={cx('wrapper')} ref={editorRef}></div>;
};

export default SummernoteEditor;
