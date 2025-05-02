import { useState, useMemo, useCallback } from 'react'
import { ToolResource, CheckoutProduct } from '@/app/(site)/(main)/tool-store/types'

/**
 * Simple basket hook: add or remove tools (Product) from the basket.
 * Also moves all pricing logic here.
 */
export function useBasket() {
    // Core state
    const [selected, setSelected] = useState<ToolResource[]>([])
    const [allTools, setAllTools] = useState<ToolResource[]>([])
    const [ownedTools, setOwnedTools] = useState<ToolResource[]>([])
    const [unownedTools, setUnownedTools] = useState<ToolResource[]>([])
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

    const [currentLicenses, setCurrentLicenses] = useState<number>(0)
    const [additionalLicenses, setAdditionalLicenses] = useState<number>(0)

    /**
     * Returns array of CheckoutProduct (tools + licenses row)
     */
    const getCheckoutProducts = useCallback<() => CheckoutProduct[]>(() => {
        const toolItems: CheckoutProduct[] = selected.map((t) => ({
            id: t.id,
            name: t.displayName,
            quantity: currentLicenses + additionalLicenses,
            price: t.price,
            logoImageUrl: t.logoImageUrl,
            iconImageUrl: t.iconImageUrl,
            isTool: true,
        }))

        const licenseItems: CheckoutProduct[] = additionalLicenses > 0
            ? [{
                id: 'licenses',
                name: 'Additional Licenses',
                quantity: additionalLicenses,
                price: 0,
                logoImageUrl: null,
                iconImageUrl: null,
                isTool: false,
            }]
            : []

        return [...toolItems, ...licenseItems]
    }, [selected, currentLicenses, additionalLicenses])

    // Derived products array for pricing
    const checkoutProducts = useMemo(
        () => getCheckoutProducts(),
        [getCheckoutProducts]
    )

    /////////////////////////
    // Pricing constants
    const FLAT_ANNUAL_RATE = 0.15 // 15% flat discount

    // Total users = first product with isTool flag quantity
    const totalUsers = useMemo(() => {
        const tool = checkoutProducts.find(p => p.isTool)
        return tool?.quantity ?? 0
    }, [checkoutProducts])

    // Tiered volume discount
    const discountRate = useMemo(() => {
        if (totalUsers > 500) return 0.50
        if (totalUsers > 100) return 0.30
        if (totalUsers > 20)  return 0.20
        return 0.00
    }, [totalUsers])

    // Compute price breakdown
    const pricing = useMemo(() => {
        // Annual list = sum(price * qty)
        const annList = checkoutProducts.reduce(
            (sum, p) => sum + (p.price ?? 0) * (p.quantity ?? 0),
            0
        )
        // Flat discount
        const annFlatDisc = annList * FLAT_ANNUAL_RATE
        const afterFlat = annList - annFlatDisc
        // Volume discount on discounted annual
        const annVolDisc = afterFlat * discountRate
        const annNet = afterFlat - annVolDisc

        // Monthly list = annList / 12
        const monList = annList / 12
        // Volume discount on monthly
        const monVolDisc = monList * discountRate
        const monNet = monList - monVolDisc

        return { annList, annFlatDisc, annVolDisc, annNet, monList, monVolDisc, monNet }
    }, [checkoutProducts, discountRate])

    return {
        // basket state
        allTools,
        setAllTools,
        ownedTools,
        setOwnedTools,
        unownedTools,
        setUnownedTools,
        selected,
        setSelected,
        addToolToSelection: useCallback((product: ToolResource) => {
            setSelected(prev => prev.some(p => p.id === product.id) ? prev : [...prev, product])
        }, []),
        removeToolFromSelection: useCallback((product: ToolResource) => {
            setSelected(prev => prev.filter(p => p.id !== product.id))
        }, []),
        isInBasket: useCallback((id: number) => selected.some(p => p.id === id), [selected]),
        reset: useCallback(() => setSelected([]), []),
        summary: useMemo(() => ({ count: selected.length, checkoutPayload: checkoutProducts }), [selected, checkoutProducts]),
        currentLicenses,
        setCurrentLicenses,
        additionalLicenses,
        setAdditionalLicenses,

        // pricing
        getCheckoutProducts,
        checkoutProducts,
        billingCycle,
        setBillingCycle,
        totalUsers,
        discountRate,
        pricing,
    }
}
