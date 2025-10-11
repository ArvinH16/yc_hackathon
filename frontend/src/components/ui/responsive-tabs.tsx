"use client";

import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/cn';

interface ResponsiveTabsProps {
  defaultValue: string;
  tabs: { value: string; label: string; content: React.ReactNode }[];
  className?: string;
}

export function ResponsiveTabs({ defaultValue, tabs, className }: ResponsiveTabsProps) {
  const [active, setActive] = React.useState(defaultValue);
  return (
    <Tabs value={active} onValueChange={setActive} className={className}>
      <div className="overflow-x-auto">
        <TabsList className={cn(
          "inline-flex w-full md:w-auto",
          "min-w-max md:min-w-0"
        )}>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="whitespace-nowrap"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
