import { PieChart, Pie, Cell, ResponsiveContainer, Sector, Legend } from 'recharts';
import { useState } from 'react';
import useWindowWidth from '../hooks/useWindowWidth';

function FeedbackPieChart({ data }) {
    const COLORS = ['#3A8F50', '#A3D977', '#8E9775', '#2F3E2E', '#FFD966'];
    const [activeIndex, setActiveIndex] = useState(null);

    const windowWidth = useWindowWidth();
    const showLabels = windowWidth > 860 || windowWidth === 540;

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    const renderActiveShape = (props) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 10}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
            </g>
        );
    };

    const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, index }) => {
        if (!showLabels) return null; // Hide labels on smaller screens

        const RADIAN = Math.PI / 180;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);

        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={COLORS[index % COLORS.length]} fill="none" />
                <circle cx={ex} cy={ey} r={3} fill={COLORS[index % COLORS.length]} stroke="none" />
                <text
                    x={ex + (cos >= 0 ? 12 : -12)}
                    y={ey}
                    textAnchor={textAnchor}
                    fill="#333"
                    fontSize="14"
                >
                    {`${data[index].name}: ${data[index].value}`}
                </text>
            </g>
        );
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-5 bg-[#FAFAF5] rounded-2xl shadow overflow-visible">
            <div className="w-full aspect-square sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[2/1]">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius="25%"
                            outerRadius="40%"
                            fill="#8884d8"
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                            labelLine={false}
                            label={renderCustomLabel}
                            isAnimationActive={false}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>

                        <Legend
                            verticalAlign="bottom"
                            payload={data.map((entry, index) => ({
                                value: entry.name,
                                type: 'square',
                                color: COLORS[index % COLORS.length]
                            }))}
                            formatter={(value, entry) => {
                                const dataIndex = data.findIndex(item => item.name === entry.value);
                                return (
                                    <span style={{
                                        fontWeight: dataIndex === activeIndex ? 'bold' : 'normal',
                                        fontSize: dataIndex === activeIndex ? '1.1rem' : '1rem',
                                        color: COLORS[dataIndex % COLORS.length],
                                        cursor: 'pointer'
                                    }}>
                                        {value}
                                    </span>
                                );
                            }}
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default FeedbackPieChart;
