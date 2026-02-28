import React from 'react';
import classNames from 'classnames';
import { Lock, Star, Check } from 'lucide-react';

export interface PathNode {
    id: string;
    title: string;
    status: 'locked' | 'current' | 'completed';
    icon?: React.ReactNode;
}

interface Props {
    nodes: PathNode[];
    onNodeClick: (node: PathNode) => void;
}

export const ProgressionPath: React.FC<Props> = ({ nodes, onNodeClick }) => {
    return (
        <div className="flex flex-col items-center py-8 relative w-full h-full min-h-[500px] overflow-y-auto">
            {/* Background connecting line */}
            <div className="absolute top-12 bottom-12 w-4 bg-slate-800 rounded-full left-1/2 -ml-2 z-0 shadow-inner"></div>

            {nodes.map((node, index) => {
                // Create an alternating zigzag pattern
                const isLeft = index % 2 === 0;
                const translateX = isLeft ? '-translate-x-12' : 'translate-x-12';

                return (
                    <div key={node.id} className={classNames("relative z-10 my-4 flex flex-col items-center transition-transform hover:scale-105", translateX)}>

                        {/* The Node Button */}
                        <button
                            onClick={() => onNodeClick(node)}
                            disabled={node.status === 'locked'}
                            className={classNames(
                                "w-20 h-20 rounded-full flex items-center justify-center border-4 relative transition-all duration-200",
                                {
                                    "bg-slate-700 border-slate-600 cursor-not-allowed opacity-80": node.status === 'locked',
                                    "bg-emerald-500 border-emerald-400 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-bounce": node.status === 'current',
                                    "bg-amber-400 border-amber-300 cursor-pointer": node.status === 'completed',
                                }
                            )}
                        >
                            {/* Node Icon */}
                            <div className={classNames("text-white", { "text-slate-400": node.status === 'locked' })}>
                                {node.status === 'locked' ? (
                                    <Lock className="w-8 h-8" />
                                ) : node.status === 'completed' ? (
                                    <Check className="w-10 h-10 text-amber-700" />
                                ) : (
                                    <Star className="w-10 h-10 fill-emerald-100 text-emerald-100" />
                                )}
                            </div>

                            {/* Node shadow/3d effect */}
                            <div className={classNames("absolute -bottom-2 w-16 h-4 rounded-full blur-sm -z-10", {
                                "bg-emerald-900/50": node.status === 'current',
                                "bg-amber-900/50": node.status === 'completed',
                                "bg-slate-900/50": node.status === 'locked',
                            })}></div>
                        </button>

                        {/* Title Badge */}
                        <div className={classNames("mt-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg border", {
                            "bg-slate-800 text-slate-400 border-slate-700": node.status === 'locked',
                            "bg-emerald-900 text-emerald-300 border-emerald-500/50": node.status === 'current',
                            "bg-amber-900 text-amber-300 border-amber-500/50": node.status === 'completed',
                        })}>
                            {node.title}
                        </div>

                    </div>
                );
            })}
        </div>
    );
};
