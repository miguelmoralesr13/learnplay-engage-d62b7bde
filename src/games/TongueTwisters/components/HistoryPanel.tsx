import React from 'react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

interface HistoryEntry {
    twisterId: string;
    accuracy: number;
    timestamp: number;
}

interface HistoryPanelProps {
    history: HistoryEntry[];
    onSelectEntry?: (entry: HistoryEntry) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelectEntry }) => {
    const chartData = history.map(entry => ({
        time: format(entry.timestamp, 'HH:mm:ss'),
        accuracy: entry.accuracy
    }));

    return (
        <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Progress History</h3>

            <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <XAxis dataKey="time" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="accuracy"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="space-y-2">
                {history.slice().reverse().map((entry, index) => (
                    <div
                        key={entry.timestamp}
                        className="flex justify-between items-center p-2 hover:bg-muted rounded cursor-pointer"
                        onClick={() => onSelectEntry?.(entry)}
                    >
                        <span>{format(entry.timestamp, 'HH:mm:ss')}</span>
                        <span className="font-medium">{entry.accuracy}%</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default HistoryPanel; 