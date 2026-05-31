import React, { useEffect, useReducer, useState } from 'react';
import { useChains, usePublicClient } from 'wagmi';
import { roundTo, toFixedNumber, toGwei } from '~/lib/utils';
import PulseText from '~/components/PulseText';
import GasGauge from '~/components/GasGauge';
import FlameMeter from '~/components/FlameMeter';
import FloatingEmbers from '~/components/FloatingEmbers';

export default function GasTracker() {
  const clientChains = useChains();
  const [currentChain, setCurrentChain] = useState(clientChains[0].id);
  const client = usePublicClient({ chainId: currentChain });

  interface GasState {
    low: number;
    average: number;
    high: number;
    lowPriorityFee: number;
    averagePriorityFee: number;
    highPriorityFee: number;
    currentBlock: number;
  }
  type OptionalGasState = Partial<GasState>;

  interface GasAction {
    payload: OptionalGasState;
  }

  function gasDataReducer(state: OptionalGasState, action: GasAction) {
    const { payload } = action;
    return {
      ...state,
      ...payload,
    };
  }

  const [gasState, setGasState] = useReducer(gasDataReducer, {});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const gasValues = [gasState.low, gasState.average, gasState.high].filter(v => v !== undefined) as number[];
  const maxGas = gasValues.length > 0 ? Math.max(...gasValues) * 1.5 : 10;

  useEffect(() => {
    const fetchGasData = async () => {
      if (!client) return;

      const functions = [
        client.getBlockNumber(),
        client.getGasPrice(),
      ];
      try {
        const [currentBlock, gasPrice] = await Promise.all(functions);
        console.log(gasPrice)

        const blockCount = 20;
        const feeHistory = await client.getFeeHistory({ blockCount, blockTag: 'latest', rewardPercentiles: [0, 30, 60] });
        const priorityFees = feeHistory.reward;
        if (!priorityFees || typeof priorityFees[0] === 'undefined') {
          throw new Error('Failed to compute priority fees.');
        }

        let [low, medium, high] = [BigInt(0), BigInt(0), BigInt(0)];
        for (const reward of priorityFees) {
          [low, medium, high] = [low + reward[0], medium + reward[1], high + reward[2]];
        }
        const formatedPriorityFees = [toGwei(low) / blockCount, toGwei(medium) / blockCount, toGwei(high) / blockCount];

        const formatedGas = [0, 1, 2].map((i) => toGwei(gasPrice) + formatedPriorityFees[i]);
        console.log(formatedGas)
        setGasState({
          payload: {
            average: roundTo(formatedGas[1], 8),
            low: roundTo(formatedGas[0], 8),
            high: roundTo(formatedGas[2], 8),
            lowPriorityFee: roundTo(formatedPriorityFees[0], 3),
            averagePriorityFee: roundTo(formatedPriorityFees[1], 3),
            highPriorityFee: roundTo(formatedPriorityFees[2], 3),
            currentBlock: Number(currentBlock),
          },
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };
    fetchGasData();

    const interval = setInterval(fetchGasData, 16000);

    return () => {
      clearInterval(interval);
    };
  }, [client]);

  const onChainSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentChain(parseInt(e.target.value));
    setLoading(true);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-[#141419] border border-[#ff4757]/20 rounded-2xl p-8 text-center max-w-md">
          <FlameMeter className="w-12 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="font-display text-2xl text-white mb-2 uppercase tracking-wide">System Error</h2>
          <p className="text-[#ff4757]/80 font-mono-data text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      <FloatingEmbers />

      {/* Header */}
      <div className="z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6 mb-10 md:mb-14 animate-fade-up">
        <div className="flex items-center gap-4">
          <FlameMeter className="w-10 h-14" />
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight text-white leading-none">
              Gas Tracker
            </h1>
            <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase mt-1.5 font-body">
              Multi-Network Monitor
            </p>
          </div>
        </div>

        <div className="relative flex items-center gap-3 animate-fade-up animate-fade-up-delay-1">
          {loading && (
            <svg className="w-4 h-4 text-[#f5a623] animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" className="opacity-20" />
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" strokeDashoffset="10" />
            </svg>
          )}
          <select
            name="Network"
            id="networks"
            value={currentChain.toString()}
            onChange={onChainSelect}
            className="appearance-none bg-[#141419] border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white font-mono-data tracking-wide focus:outline-none focus:border-[#f5a623]/40 focus:ring-1 focus:ring-[#f5a623]/10 cursor-pointer transition-colors hover:border-white/20"
          >
            {clientChains.map((chain, i) => (
              <option key={i} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Gauges */}
      <div className="z-10 flex items-end justify-center gap-3 md:gap-10 mb-8 md:mb-12 animate-fade-up animate-fade-up-delay-2">
        <div className="pb-4">
          <GasGauge
            value={gasState.low}
            label="Low"
            color="#00d4aa"
            size={170}
            loading={loading}
            maxVal={maxGas}
          />
        </div>

        <div>
          <GasGauge
            value={gasState.average}
            label="Average"
            color="#f5a623"
            size={240}
            loading={loading}
            maxVal={maxGas}
            live
          />
        </div>

        <div className="pb-4">
          <GasGauge
            value={gasState.high}
            label="High"
            color="#ff4757"
            size={170}
            loading={loading}
            maxVal={maxGas}
          />
        </div>
      </div>

      {/* Info strip */}
      <div className="z-10 flex flex-col items-center gap-8 animate-fade-up animate-fade-up-delay-3">
        {/* Block number */}
        <div className="flex items-center gap-3 bg-[#141419]/60 border border-white/5 rounded-full px-5 py-2 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-white/30">Block</span>
          <PulseText className="font-mono-data text-sm text-white/80 ml-1">
            #{gasState.currentBlock ?? '---'}
          </PulseText>
        </div>

        {/* Priority fees */}
        <div className="flex items-center gap-4 md:gap-8 animate-fade-up animate-fade-up-delay-4">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#00d4aa]/50 font-body font-medium">
              Low Priority
            </span>
            <span className="font-mono-data text-sm text-white/70">
              {gasState.lowPriorityFee ?? '--'} Gwei
            </span>
          </div>
          <div className="w-px h-8 bg-white/8" />
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#f5a623]/50 font-body font-medium">
              Avg Priority
            </span>
            <span className="font-mono-data text-sm text-white/70">
              {gasState.averagePriorityFee ?? '--'} Gwei
            </span>
          </div>
          <div className="w-px h-8 bg-white/8" />
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#ff4757]/50 font-body font-medium">
              High Priority
            </span>
            <span className="font-mono-data text-sm text-white/70">
              {gasState.highPriorityFee ?? '--'} Gwei
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
