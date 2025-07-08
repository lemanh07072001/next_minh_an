'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";


export default function AppBreadcrumbs(){
    const pathname = usePathname();

    const segments = pathname.split('/').filter(Boolean).slice(2);

    const breadcrumbs = segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const label = decodeURIComponent(segment)
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());

        return { href, label };
    });

    return(
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/admin/dashboard">Home</BreadcrumbLink>
                </BreadcrumbItem>

                {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.href} className="flex items-center">
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            {index === breadcrumbs.length - 1 ? (
                                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}