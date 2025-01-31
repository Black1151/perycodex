// SankeyTooltipRenderer.ts
import { AgSankeySeriesTooltipRendererParams } from 'ag-charts-enterprise';

const SankeyTooltipRenderer = (params: AgSankeySeriesTooltipRendererParams<any>): string => {
    const { datum, color } = params;
    // For Sankey links, "datum" will typically have { from, to, value }
    // For Sankey nodes, "datum" might have { label } and be flagged as "isNode"

    const isNode = (datum as any)?.isNode === true;
    if (isNode) {
        // If you want a tooltip for the node itself
        const nodeLabel = (datum as any)?.label ?? 'N/A';
        return `
      <div class="ag-chart-tooltip" style="border: 1px solid ${color}; border-radius: 8px; background-color: white; font-family: Arial, sans-serif; font-size: 12px;">
        <div class="ag-chart-tooltip-title" style="background-color: ${color}; font-weight: bold; color: white; padding: 8px; border-radius: 8px 8px 0 0;">
          Sankey Node
        </div>
        <div class="ag-chart-tooltip-content" style="padding: 8px; border-radius: 0 0 8px 8px;">
          <p>${nodeLabel}</p>
        </div>
      </div>
    `;
    } else {
        // If it's a link
        const fromValue = (datum as any)?.from ?? 'N/A';
        const toValue = (datum as any)?.to ?? 'N/A';
        const weightValue = (datum as any)?.value ?? 'N/A';

        return `
      <div class="ag-chart-tooltip" style="border: 1px solid ${color}; border-radius: 8px; background-color: white; font-family: Arial, sans-serif; font-size: 12px;">
        <div class="ag-chart-tooltip-title" style="background-color: ${color}; font-weight: bold; color: white; padding: 8px; border-radius: 8px 8px 0 0;">
          Sankey Link
        </div>
        <div class="ag-chart-tooltip-content" style="padding: 8px; border-radius: 0 0 8px 8px;">
          <p>${fromValue} &rarr; ${toValue}: ${weightValue}</p>
        </div>
      </div>
    `;
    }
};

export default SankeyTooltipRenderer;
