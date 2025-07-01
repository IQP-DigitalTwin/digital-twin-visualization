'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface MapToolbarProps {
  onViewChange: (view: 'suppliers' | 'timesSwitched') => void;
  onResetZoom: () => void;
}

export default function MapToolbar({ onViewChange, onResetZoom }: MapToolbarProps) {
  const [activeView, setActiveView] = useState<'suppliers' | 'timesSwitched'>('suppliers');

  const handleViewChange = (view: 'suppliers' | 'timesSwitched') => {
    setActiveView(view);
    onViewChange(view);
  };

  return (
    <div className="flex space-x-2 p-2 bg-background rounded-md shadow-md">
      <Button onClick={onResetZoom}>
        Reset Zoom
      </Button>
      <Button
        variant={activeView === 'suppliers' ? 'default' : 'outline'}
        onClick={() => handleViewChange('suppliers')}
      >
        Suppliers
      </Button>
      <Button
        variant={activeView === 'timesSwitched' ? 'default' : 'outline'}
        onClick={() => handleViewChange('timesSwitched')}
      >
        Times Switched
      </Button>
    </div>
  );
}
