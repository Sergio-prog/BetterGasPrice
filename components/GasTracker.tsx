'use client';

import "../app/globals.css"
import React, { useEffect, useReducer, useState } from 'react';
import { Fuel, ArrowDown, ArrowUp } from 'lucide-react';
import { useChains, usePublicClient } from 'wagmi';
import { roundTo, toFixedNumber, toGwei } from '../lib/utils';
import PulseText from "./PulseText";

export default function GasTracker() {
  const client = usePublicClient()
  const clientChains = useChains()
  const currentChain = clientChains[0]

  enum GasActionKind {}

  interface GasState {
    low: number;
    average: number;
    high: number;
    lowPriorityFee: number;
    averagePriorityFee: number;
    highPriorityFee: number;
    currentBlock: number;
  }
  type OptionalGasState = Partial<GasState>

  interface GasAction {
    payload: OptionalGasState;
  }

  function gasDataReducer(state: OptionalGasState, action: GasAction) {
    const { payload } = action;
    console.log(`Payload ${payload}`);
    console.log(payload)
    return {
      ...state,
      ...payload,
    }
  }

  // Mock data - in a real app, this would come from an API
  const [gasState, setGasState] = useReducer(gasDataReducer, {});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGasData = async () => {
      if (!client) return;

      const functions = [
        client.getBlockNumber(),
        client.getGasPrice(),
      ]
      try {
        const [currentBlock, gasPrice] = await Promise.all(functions)
        console.log(currentBlock, gasPrice);

        const priorityFees = [0, 0.015, 0.1]
        
        const formatedGas = toGwei(gasPrice)
        setGasState({
          payload: {
            average: roundTo(formatedGas + priorityFees[1], 6),
            low: roundTo(formatedGas + priorityFees[0], 6),
            high: roundTo(formatedGas + priorityFees[2], 6),
            lowPriorityFee: priorityFees[0],
            averagePriorityFee: priorityFees[1],
            highPriorityFee: priorityFees[2],
            currentBlock: Number(currentBlock),
          }
        })
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setLoading(false)
      }
    }
    fetchGasData();

    const interval = setInterval(fetchGasData, 16000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const gasToString = (num: number | undefined) => {
    if (typeof num === "undefined") return "--"
    return toFixedNumber(num)
  }

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-white text-xl">Loading gas prices...</div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }
  
  return (
    <div className="h-screen max-h-screen relative flex flex-col p-4 overflow-hidden">
      {/* <div className="w-full h-full flex flex-col"> */}
          <div className="flex justify-center mt-8 z-10">
            <select name="Network" id="networks" className="text-black rounded-md py-3 px-7 bg-gray-300 text-lg">
              {
                clientChains.map((chain, i) => (
                  <option id={i.toString()} value={chain.name}>{chain.name}</option>
                ))
              }
            </select>
          </div>
      <div className="fixed inset-0 flex items-center justify-center pb-8">
      <div className="max-w-6xl w-full flex flex-col items-center space-y-8 px-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Ethereum Gas Tracker</h1>
          <p className="text-gray-300">Current Block: <PulseText>#{gasState.currentBlock}</PulseText></p>
        </div>

        {/* Gas Price Cards */}
        <div className="flex justify-center items-center flex-wrap gap-7 relative w-full px-4">
          {/* Low Price */}
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 transform -rotate-6 scale-90 transition-transform hover:scale-95 w-[150px] overflow-hidden">
            <div className="text-center">
              <ArrowDown className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h2 className="text-xl text-gray-200 mb-1">Low</h2>
              <PulseText className="text-4xl font-bold text-green-400">{gasToString(gasState.low)}</PulseText>
              <p className="text-sm text-gray-300">GWEI</p>
            </div>
          </div>

          {/* Average Price - Centered and Larger */}
          <div className="backdrop-blur-lg bg-white/20 rounded-2xl p-10 z-10 transform transition-transform hover:scale-[103%] pb-4 w-[215px] overflow-hidden">
            <div className="text-center">
              <Fuel className="w-12 h-12 text-blue-400 mx-auto mb-2" />
              <h2 className="text-2xl text-gray-100 mb-1">Average</h2>
              <PulseText className="text-6xl font-bold text-blue-400">{gasToString(gasState.average)}</PulseText>
              <p className="text-sm text-gray-200">GWEI</p>
              <p className="mt-1 text-sm text-white text-opacity-60">{`Priority: ${gasState.averagePriorityFee ?? "--"}`}</p>
            </div>
          </div>

          {/* High Price */}
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 transform rotate-6 scale-90 transition-transform hover:scale-95 w-[150px] overflow-hidden">
            <div className="text-center">
              <ArrowUp className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <h2 className="text-xl text-gray-200 mb-1">High</h2>
              <PulseText className="text-4xl font-bold text-red-400">{gasToString(gasState.high)}</PulseText>
              <p className="text-sm text-gray-300">GWEI</p>
            </div>
          </div>
        </div>
      </div>
      </div>

      <footer>
        {/* <p>{currentChain.name}</p> */}
      </footer>
    </div>
  );
}