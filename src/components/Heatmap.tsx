import React from "react";

export default function Heatmap() {
    const days = ['Fri, 04 Apr', 'Sat, 05 Apr', 'Sun, 06 Apr', 'Mon, 07 Apr', 'Tue, 08 Apr', 'Wed, 09 Apr', 'Thu, 10 Apr', 'Fri, 11 Apr'];
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    
    const mockHeatmapData = days.map(() => 
        hours.map(() => Math.floor(Math.random() * 60))
    );

    return (
        <div className="bg-[#141419] border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex gap-4 mb-4">
            <button className="bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/20 px-4 py-2 rounded-lg text-sm font-medium tracking-wide">Heatmap</button>
            <button className="bg-white/5 text-white/40 border border-white/5 px-4 py-2 rounded-lg text-sm font-medium tracking-wide hover:bg-white/10 transition-colors">Chart</button>
          </div>
          
          <h2 className="text-xl font-display font-bold text-white mb-6 uppercase tracking-wide">Average Gas Prices</h2>
          
          <div className="flex">
            {/* Day labels */}
            <div className="pr-4 flex flex-col justify-around text-white/30 font-mono-data text-xs">
              {days.map((day, i) => (
                <div key={i} className="h-8 flex items-center">{day}</div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex-grow">
              <div className="grid grid-cols-24 gap-1">
                {mockHeatmapData.map((row, i) => (
                  <React.Fragment key={i}>
                    {row.map((value, j) => (
                      <div
                        key={`${i}-${j}`}
                        className="h-8 rounded-[2px]"
                        style={{
                          backgroundColor: `rgba(255, 107, 43, ${value / 60})`
                        }}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>

              {/* Hour labels */}
              <div className="grid grid-cols-24 gap-1 mt-2">
                {hours.map((hour, i) => (
                  <div key={i} className="text-white/20 text-[10px] text-center font-mono-data">
                    {i % 2 === 0 ? hour : ''}
                  </div>
                ))}
              </div>
              <div className="text-white/20 text-[10px] text-center mt-1 font-body tracking-wider">
                Hours (UTC)
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-3 w-32 rounded-full bg-gradient-to-r from-[rgba(255,107,43,0.08)] to-[rgba(255,107,43,1)]" />
            <div className="flex justify-between w-32 text-white/30 text-[10px] font-mono-data">
              <span>0</span>
              <span>20</span>
              <span>40</span>
              <span>60</span>
            </div>
          </div>
        </div>
    )
}
