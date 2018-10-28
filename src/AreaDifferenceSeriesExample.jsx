import React from 'react';
import { LegendOrdinal } from '@vx/legend';
import { scaleOrdinal } from '@vx/scale';

import { color as colors, allColors } from '@data-ui/theme';
import { AreaSeries, AreaDifferenceSeries, CrossHair, PatternLines, XAxis, YAxis } from '@data-ui/xy-chart';

import ResponsiveXYChart, { formatYear } from './ResponsiveXYChart';
import { timeSeriesData } from './data';

const COLOR_1 = allColors.pink[2];
const COLOR_2 = allColors.blue[2];
const PATTERN_ID = 'threshold-pattern-id';

const legendScale = scaleOrdinal({
    range: [`url(#${PATTERN_ID})`, COLOR_2],
    domain: ['Purple', 'Pink'],
});

const seriesProps = [
    {
        seriesKey: 'Purple',
        key: 'Purple',
        stroke: COLOR_1,
        fill: `url(#${PATTERN_ID})`,
        fillOpacity: 1,
    },
    {
        seriesKey: 'Pink',
        key: 'Pink',
        stroke: COLOR_2,
        fill: COLOR_2,
        fillOpacity: 0.4,
    },
];

const randomTimeSeries = timeSeriesData.map((d) => ({
    ...d,
    y: Math.random() < 0.5 ? d.y * 5 : d.y / 5,
}));

class AreaDifferenceSeriesExample extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            threshold: 0.4,
        };

        this.renderControls = this.renderControls.bind(this);
        this.renderTooltip = this.renderTooltip.bind(this);
    }

    renderControls() {
        const { threshold } = this.state;

        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div>
                    <span style={{ color: seriesProps[1].stroke }}>Pink</span> multiplier{' '}
                    <input type="range" min="0" max="1" step="0.025" value={threshold} onChange={(e) => this.setState({ threshold: Number(e.target.value) })} /> {threshold.toFixed(2)}
                </div>
            </div>
        );
    }

    renderTooltip({ datum, series }) {
        return (
            <div>
                <strong>{formatYear(datum.x)}</strong>
                <br />
                <br />
                {seriesProps.map(
                    ({ seriesKey, stroke: color }) =>
                        series &&
                        series[seriesKey] && (
                            <div key={seriesKey}>
                                <span
                                    style={{
                                        color,
                                        textDecoration: series[seriesKey] === datum ? `underline ${color}` : null,
                                        fontWeight: series[seriesKey] === datum ? 600 : 200,
                                    }}
                                >
                                    {`${seriesKey}`}
                                </span>
                                {` ${series[seriesKey].y.toFixed(1)}`}
                            </div>
                        )
                )}
            </div>
        );
    }

    render() {
        const { threshold } = this.state;
        const thresholdData = randomTimeSeries.map((d) => ({
            ...d,
            y: threshold * d.y,
        }));

        return (
            <div>
                <ResponsiveXYChart
                    ariaLabel="Threshold series example"
                    snapTooltipToDataX
                    eventTrigger="container"
                    xScale={{ type: 'time' }}
                    yScale={{ type: 'linear' }}
                    width={1000}
                    height={440}
                    margin={{ top: 20, left: 5 }}
                    renderTooltip={this.renderTooltip}
                >
                    <PatternLines id={PATTERN_ID} height={5} width={5} stroke={COLOR_1} strokeWidth={1} orientation={['diagonal']} />
                    <AreaDifferenceSeries>
                        <AreaSeries {...seriesProps[0]} data={timeSeriesData} />
                        <AreaSeries {...seriesProps[1]} data={thresholdData} />
                    </AreaDifferenceSeries>
                    <CrossHair fullHeight showHorizontalLine={false} strokeDasharray="" stroke={colors.darkGray} circleStroke={colors.darkGray} circleFill="white" />
                    <XAxis label="Time" numTicks={5} />
                    <YAxis numTicks={4} />
                </ResponsiveXYChart>
            </div>
        );
    }
}

export default AreaDifferenceSeriesExample;
