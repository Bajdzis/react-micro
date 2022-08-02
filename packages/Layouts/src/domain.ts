import React from "react"

export interface LayoutProps<RootSlotKeys extends string> {
    slots: {[key in RootSlotKeys]: React.ComponentType<{}>}
    fallback?: React.ReactElement;
}
