import {AgPieSeriesTooltipRendererParams} from 'ag-charts-enterprise';

const PieChartTooltipRenderer = (params: AgPieSeriesTooltipRendererParams<any>): string => {
    const {datum, color} = params;

    // Extract category and value from datum
    const category = datum?.category ?? 'N/A';
    const value = datum?.value ?? 'N/A';

    return `
      <div class="ag-chart-tooltip" style="border: 1px solid ${color}; border-radius: 8px; background-color: white; font-family: Arial, sans-serif; font-size: 12px;">
        <div class="ag-chart-tooltip-title" style="background-color: ${color}; font-weight: bold; color: white; padding: 8px; border-radius: 8px 8px 0 0;">
          ${category}
        </div>
        <div class="ag-chart-tooltip-content" style="padding: 8px; border-radius: 0 0 8px 8px;">
          <p>Value: ${value}</p>
        </div>
      </div>
    `;
};

export default PieChartTooltipRenderer;
