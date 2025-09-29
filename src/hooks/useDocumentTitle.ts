// src/hooks/useDocumentTitle.ts
import { useEffect } from 'react';

/**
 * Custom hook để quản lý document title
 * @param title - Title muốn hiển thị
 * @param restoreOnUnmount - Có restore title cũ khi component unmount không (default: true)
 */
export const useDocumentTitle = (title: string, restoreOnUnmount: boolean = true) => {
    useEffect(() => {
        // Lưu title hiện tại
        const previousTitle = document.title;

        // Cập nhật title mới
        document.title = title;

        // Cleanup function - restore title cũ khi component unmount
        return () => {
            if (restoreOnUnmount) {
                document.title = previousTitle;
            }
        };
    }, [title, restoreOnUnmount]);
};

export default useDocumentTitle;