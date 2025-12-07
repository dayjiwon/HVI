import React from "react";
import { motion } from 'framer-motion';
import { School, Coffee, Home, MapPin } from 'lucide-react';

const destinations = [
  { icon: School, label: '인하대학교', color: '#2D9CFF' },
  { icon: Coffee, label: '스타벅스 송도점', color: '#00B5F5' },
  { icon: Home, label: '자택', color: '#2D9CFF' },
];

export default function DestinationCards() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
      <div className="text-sm text-gray-600 mb-2">빠른 목적지</div>
      
      <div className="flex flex-col gap-3 w-full">
        {destinations.map((dest, index) => {
          const Icon = dest.icon;
          return (
            <motion.button
              key={dest.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl border border-gray-200/50 hover:border-[#2D9CFF]/50 transition-all"
            >
              {/* Glow indicator on hover */}
              <motion.div
                className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#2D9CFF]"
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              />

              <div
                className="p-2 rounded-xl"
                style={{ backgroundColor: `${dest.color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color: dest.color }} />
              </div>
              
              <div className="flex-1 text-left">
                <div className="text-sm text-gray-800">{dest.label}</div>
              </div>

              <MapPin className="w-4 h-4 text-gray-400 group-hover:text-[#2D9CFF] transition-colors" />
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 px-4 py-2 bg-gray-100/50 rounded-full text-xs text-gray-500">
        더 많은 목적지 보기
      </div>
    </div>
  );
}
