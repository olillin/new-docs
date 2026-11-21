export function PageNavigationSkeleton() {
    return (
        <nav
            aria-label="Loading main navigation..."
            className="order mb-8 flex gap-2 overflow-hidden rounded-4xl border-white/10 bg-[#0a0a0a] p-4"
        >
            <NavigationItemSkeleton />
            <NavigationItemSkeleton />
            <NavigationItemSkeleton />
        </nav>
    )
}

function NavigationItemSkeleton() {
    return (
        <span className="flex flex-1 items-center justify-center rounded-2xl border-2 px-4 py-2 text-sm font-medium text-white/80 transition-colors">
            &nbsp;
        </span>
    )
}
