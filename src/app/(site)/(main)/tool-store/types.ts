// types.ts

/**
 * Return type for the useBasket hook.
 */
export interface UseBasketReturn {
    /** Currently selected tools in basket */
    selected: ToolResource[]
    /** Add a tool to the basket */
    addTool: (product: ToolResource) => void
    /** Remove a tool from the basket by ID */
    removeTool: (id: string) => void
    /** Check if a tool is in the basket */
    isInBasket: (id: string) => boolean
    /** Clear all selections */
    reset: () => void
    /** Summary for checkout */
    summary: {
        /** Number of tools selected */
        count: number
        /** IDs of selected tools for payload */
        checkoutPayload: string[]
    }
}

/**
 * Response shape when fetching available tools.
 */
export interface ToolSelectionPageResponse {
    resource: ToolResource[]
}

/**
 * Server-side representation of a tool.
 */
export interface ToolResource {
    id: number
    displayName: string
    previewText: string
    showInSeeMoreList: boolean
    logoImageUrl: string
    iconImageUrl: string
    appUrl: string
    price: 60
    userOwns: boolean
    isTrial: boolean
    isTrialUntil: string
    isComingSoon: boolean
}

/**
 * Basket item type extending ToolResource for UI purposes.
 */
export interface ToolBasketItem extends ToolResource {
    /** Desired count for this tool */
    quantity: number
    /** Billing cycle chosen */
    billingCycle: 'monthly' | 'annual'
}

/**
 * Server-side record of a user’s tool purchase.
 */
export interface ToolCustomerResource {
    id: number
    customerId: number
    toolConfigId: number
    isTrial: boolean
    trialStartDate: string
    trialEndDate: string
    createdAt: string
    updatedAt: string
}

/**
 * Summary of a user’s license counts.
 */
export interface UserLicenses {
    totalLicenses: number
    usedLicenses: number
}

export interface CheckoutProduct {
    id: number | 'licenses'
    name: string
    logoImageUrl: string | null
    iconImageUrl: string | null
    monthlyPrice?: number
    annualPrice?: number
    price: number
    billingCycle?: 'monthly' | 'annual'
    quantity?: number
    isTool?: boolean
  }