import { Link } from '@inertiajs/react';
import { ActivityIcon, Ban, CheckCircle, Clock, Ticket, UserPlus, X } from 'lucide-react';

export type RecentActivityItem = {
    id: number | string;
    type: string;
    status: string | null;
    title: { en: string; am: string };
    desc: { en: string; am: string };
    time: string;
    link?: string | null;
    cycle?: number | null;
};

function getActivityIcon(type: string, status: string | null) {
    if (type === 'TICKET_HISTORY') {
        if (status === 'success') {
            return <Ticket className="h-5 w-5 text-royal" />;
        }
        if (status === 'error') {
            return <Ban className="h-5 w-5 text-red-500" />;
        }
        if (status === 'warning') {
            return <Clock className="h-5 w-5 text-royal" />;
        }
        return <Ticket className="h-5 w-5 text-stone-400" />;
    }

    if (type === 'TICKET' || type === 'TICKET_RESERVED') {
        return <Ticket className="h-5 w-5 text-royal" />;
    }

    if (type === 'JOINED') {
        return <UserPlus className="h-5 w-5 text-blue-500" />;
    }

    if (type.startsWith('PAYMENT')) {
        if (status === 'success') {
            return <CheckCircle className="h-5 w-5 text-royal" />;
        }
        if (status === 'error') {
            return <X className="h-5 w-5 text-red-500" />;
        }
        return <Clock className="h-5 w-5 text-royal" />;
    }

    return <ActivityIcon className="h-5 w-5 text-stone-400" />;
}

export default function ActivityTimeline({
    items,
    viewAllHref,
    label,
}: {
    items: RecentActivityItem[];
    viewAllHref: string;
    label: string;
}) {
    return (
        <div
            id="history-section"
            className="animate-fade-in-up rounded-2xl border border-blue-100 bg-white p-6 shadow-sm delay-[400ms]"
        >
            <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center font-bold text-navy">
                    <ActivityIcon className="mr-2 h-5 w-5 text-royal" />
                    {label}
                </h3>
                <Link
                    href={viewAllHref}
                    prefetch
                    className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-navy transition-colors hover:bg-blue-100"
                >
                    View All ({items.length})
                </Link>
            </div>
            {items.length === 0 ? (
                <div className="py-8 text-center text-sm text-stone-400">
                    No recent activity.
                </div>
            ) : (
                <div className="relative ml-3 space-y-8 border-l-2 border-blue-100 py-2">
                    {items.slice(0, 3).map((item) => (
                        <div key={item.id} className="relative pl-8">
                            <div
                                className={`absolute top-0 -left-[9px] h-4 w-4 rounded-full border-2 border-white shadow-sm ${
                                    item.status === 'success'
                                        ? 'bg-royal'
                                        : item.status === 'error'
                                          ? 'bg-red-500'
                                          : item.status === 'warning'
                                            ? 'bg-royal'
                                            : item.status === 'neutral'
                                              ? 'bg-stone-300'
                                              : 'bg-blue-500'
                                }`}
                            ></div>
                            <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <h4 className="flex items-center text-sm font-bold text-navy">
                                    {getActivityIcon(item.type, item.status)}
                                    <span className="ml-2">
                                        {item.title.en}
                                    </span>
                                </h4>
                                <span className="mt-1 font-mono text-xs text-stone-400 sm:mt-0">
                                    {new Date(item.time).toLocaleString()}
                                </span>
                            </div>
                            <p className="inline-block rounded-xl border border-blue-50 bg-blue-50/40 p-2 text-xs leading-relaxed text-stone-500">
                                {item.desc.en}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
