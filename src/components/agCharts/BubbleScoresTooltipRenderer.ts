import { AgBubbleSeriesTooltipRendererParams } from "ag-charts-enterprise";

const BubbleScoresTooltipRenderer = (params: AgBubbleSeriesTooltipRendererParams): string => {
    const { color, datum, xKey, yKey, sizeKey } = params;

    // Extract data with fallback values
    const xValue = datum?.[xKey] || "N/A"; // e.g., Score
    const yValue = datum?.[yKey] || "N/A"; // e.g., Day
    const sizeValue = datum?.[sizeKey]?.toFixed(0) || "N/A"; // e.g., Submissions

    // Tooltip HTML string, styled similarly to `ScoreTooltipRenderer`
    return `
    <div class="ag-chart-tooltip" style="border: 1px solid ${color}; border-radius: 8px; background-color: white; font-family: Arial, sans-serif; font-size: 12px;">
      <div class="ag-chart-tooltip-title" style="background-color:${color}; font-weight: bold; color: white; padding: 8px; border-radius: 8px 8px 0 0;">
        Day: ${yValue}
      </div>
      <div class="ag-chart-tooltip-content" style="padding: 8px; border-radius: 0 0 8px 8px;">
        <strong>Score:</strong> ${xValue}<br />
        <strong>Submissions:</strong> ${sizeValue}
      </div>
    </div>
  `;
};

export default BubbleScoresTooltipRenderer;
