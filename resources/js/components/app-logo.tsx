export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg">
                <img
                    src="/logo-square.png"
                    alt="AfroEqub"
                    className="h-8 w-8 object-contain"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold text-navy dark:text-white">
                    Afro<span className="text-royal">Equb</span>
                </span>
            </div>
        </>
    );
}
