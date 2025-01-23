import { AgCartesianSeriesTooltipRendererParams } from "ag-charts-enterprise";

const ScoreTooltipRenderer = (params: AgCartesianSeriesTooltipRendererParams): string => {
    const { color, datum, xKey, yKey } = params;

    // Extract data for rendering
    const xValue = datum[xKey] || "N/A";
    const yValue = datum[yKey]?.toFixed(2) || "N/A";

    return `
    <div class="ag-chart-tooltip" style="border: 1px solid ${color}; border-radius: 8px;">
      <div class="ag-chart-tooltip-title" style="background-color:${params.color}; font-weight: bold; ; border: 1px solid white; border-radius: 8px 8px 0 0;">${xValue}</div>
      <div class="ag-chart-tooltip-content" style="border: 1px solid white; border-radius: 0 0 8px 8px;">
        <span>Score: ${yValue}</span><br />
      </div>
    </div>
  `;
};

export default ScoreTooltipRenderer;
