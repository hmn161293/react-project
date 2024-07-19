import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'; // Assuming these components are correctly imported
import { cn } from "../lib/utils";
import { LayoutPanelLeft, Puzzle, Mail, MessageSquare, CalendarDays, TrendingUp , Menu} from 'lucide-react';

export const Sidebar = () => {
  return (
    <div className={cn("h-full pb-12")} style={{ width: '70px' }}> 
      <Tabs className="flex flex-col">
        <TabsList className="flex flex-col">
          <TabsTrigger value="test0" className="relative flex items-center p-2">
          <LayoutPanelLeft />
          </TabsTrigger>
          <TabsTrigger value="test1" className="relative flex items-center p-2">
          <Puzzle />
          </TabsTrigger>
          <TabsTrigger value="test2" className="relative flex items-center p-2">
          <Mail />
          </TabsTrigger>
          <TabsTrigger value="test3" className="relative flex items-center p-2">
          <MessageSquare />
          </TabsTrigger>
          <TabsTrigger value="test4" className="relative flex items-center p-2">
          <CalendarDays />
          </TabsTrigger>
          <TabsTrigger value="test5" className="relative flex items-center p-2">
          <TrendingUp />
          </TabsTrigger>
          <TabsTrigger value="test6" className="relative flex items-center p-2">
          <Menu />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="test" className="border-none p-0 outline-none">
        </TabsContent>
      </Tabs>
    </div>
  );
}


