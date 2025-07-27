import React, { useEffect, useState } from 'react';

export default function HtmlRenderer() {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    async function fetchHtml() {
      try {
        const response = await fetch('/dashboard');
        const data = await response.text(); // important: get text, not JSON
        setHtmlContent(data);
      } catch (error) {
        console.error('Failed to fetch HTML:', error);
      }
    }

    fetchHtml();
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
