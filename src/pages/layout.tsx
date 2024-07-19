import React from 'react';
import { Menu } from "../components/menu";
import { Sidebar } from "../components/sidebar";
import { Outlet } from "react-router-dom";
import { Separator } from '../ui/separator';

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="w-full bg-white shadow-md z-10">
        <Menu />
      </div>

      <Separator className="bg-gray-300" />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-30 bg-white">
          <Sidebar />
        </div>
        <Separator orientation="vertical" className="bg-gray-300" />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;