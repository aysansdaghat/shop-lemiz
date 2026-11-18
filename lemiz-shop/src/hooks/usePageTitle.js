import { useEffect } from 'react';

export function usePageTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | لمیز` : 'لمیز | فروشگاه لباس با طرح‌های خاص';
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
  }, [title, description]);
}
