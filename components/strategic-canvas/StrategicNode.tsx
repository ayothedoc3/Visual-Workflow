import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Target, Lightbulb, Trophy, TrendingUp } from 'lucide-react';

interface StrategicNodeProps {
  data: {
    id: string;
    type: 'campaign' | 'strategy' | 'result';
    label: string;
    description: string;
    overallProgress: number;
    status: string;
    linkedPlaybookId?: string;
    onDoubleClick?: (nodeId: string, nodeData: any) => void;
  };
}

export const StrategicNode = memo(({ data }: StrategicNodeProps) => {
  const getNodeStyle = () => {
    switch (data.type) {
      case 'campaign':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
          border: 'border-blue-400',
          icon: Target,
          iconColor: 'text-blue-600'
        };
      case 'strategy':
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
          border: 'border-purple-400',
          icon: Lightbulb,
          iconColor: 'text-purple-600'
        };
      case 'result':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-green-100',
          border: 'border-green-400',
          icon: Trophy,
          iconColor: 'text-green-600'
        };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'on-track':
        return 'bg-cyan-500';
      case 'at-risk':
        return 'bg-yellow-500';
      case 'blocked':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const style = getNodeStyle();
  const Icon = style.icon;

  return (
    <div
      className={`${style.bg} ${style.border} border-2 rounded-lg shadow-lg p-4 min-w-[250px] max-w-[300px] transition-all hover:shadow-xl`}
      onDoubleClick={() => data.onDoubleClick?.(data.id, data)}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-start gap-3 mb-2">
        <Icon className={`w-6 h-6 ${style.iconColor} flex-shrink-0 mt-1`} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 break-words">
            {data.label}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2 break-words">
            {data.description}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600">Progress</span>
          <span className="text-xs font-medium text-gray-900">{data.overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${getStatusColor(data.status)} transition-all duration-300`}
            style={{ width: `${data.overallProgress}%` }}
          />
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between mt-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(data.status)} text-white`}>
          {data.status}
        </span>
        {data.linkedPlaybookId && (
          <TrendingUp className="w-4 h-4 text-gray-400" aria-label="Linked to playbook" />
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});

StrategicNode.displayName = 'StrategicNode';
