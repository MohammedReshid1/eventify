import React from 'react';
import { Button } from '@/components/ui/button';

const TestPage = () => {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Test Page</h1>
      <p className="mb-4">This is a simple test page to verify the application is working.</p>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">UI Components Test</h2>
        <div className="space-y-4">
          <Button variant="default">Default Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button className="orange-button">Orange Button</Button>
        </div>
      </div>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Application Status</h2>
        <p>The application is running correctly if you can see this page with styled buttons above.</p>
      </div>
    </div>
  );
};

export default TestPage; 