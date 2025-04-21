import React from "react";

export default function Heatmap() {
    // Generate mock data for 7 days and 24 hours
    const days = ['Fri, 04 Apr', 'Sat, 05 Apr', 'Sun, 06 Apr', 'Mon, 07 Apr', 'Tue, 08 Apr', 'Wed, 09 Apr', 'Thu, 10 Apr', 'Fri, 11 Apr'];
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    
    const mockHeatmapData = days.map(() => 
        hours.map(() => Math.floor(Math.random() * 60))
    );

    return (
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6">
          <div className="flex gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Heatmap</button>
            <button className="bg-white/10 text-white px-4 py-2 rounded-lg">Chart</button>
          </div>
          
          <h2 className="text-2xl font-bold text-white my-4">Average Gas Prices</h2>
          
          <div className="flex">
            {/* Day labels */}
            <div className="pr-4 flex flex-col justify-around text-gray-400">
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
                        className="h-8"
                        style={{
                          backgroundColor: `rgba(255, 140, 85, ${value / 60})`
                        }}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>

              {/* Hour labels */}
              <div className="grid grid-cols-24 gap-1 mt-2">
                {hours.map((hour, i) => (
                  <div key={i} className="text-gray-400 text-sm text-center">
                    {i % 2 === 0 ? hour : ''}
                  </div>
                ))}
              </div>
              <div className="text-gray-400 text-sm text-center mt-1">
                Hours (UTC)
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center gap-2">
            <div className="h-4 w-32 bg-gradient-to-r from-[rgba(255,140,85,0.1)] to-[rgba(255,140,85,1)]"></div>
            <div className="flex justify-between w-32 text-gray-400 text-sm">
              <span>0</span>
              <span>20</span>
              <span>40</span>
              <span>60</span>
            </div>
          </div>
        </div>
    )
}