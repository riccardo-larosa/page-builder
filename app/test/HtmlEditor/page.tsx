'use client';

import HTMLEditor from '@/app/editor/PageComponents/HtmlEditor';

export default function HtmlEditor() {
  const handleChange = (newCode: string) => {
    console.log('HTML changed:', newCode);
  };

  return (
    <div>
      <h1>My Page</h1>
      <HTMLEditor 
        initialValue="<h1>Hello World</h1>" 
        onChange={handleChange}
      />
    </div>
  );
}