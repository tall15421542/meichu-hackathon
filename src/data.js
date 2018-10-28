import { cityTemperature, appleStock, genRandomNormalPoints, letterFrequency, genStats } from '@vx/mock-data';

export const timeSeriesData = appleStock.filter((d, i) => i % 120 === 0).map((d) => ({
    x: new Date(d.date),
    y: d.close,
}));
