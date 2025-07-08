"use client";
import { useEffect, useState, useTransition} from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SessionProvider } from "next-auth/react";
import {useParams} from "next/navigation";
import {usePathname,useRouter} from "@/i18n/navigation";



export default function SelectChangeFlag() {
    const [defaultFlag, setDefaultFlag] = useState('vi');
    const [isPending, startTransition] = useTransition();

    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();

    const locales = [
        {
            value: "vi",
            label: "Tiếng Việt",
            flag: "/flags/vietnam-flag-icon.svg"  // SVG trong thư mục public
        },
        {
            value: "en",
            label: "English",
            flag: "/flags/us-flag-icon.svg"
        }
    ];

    // ✅ Cập nhật defaultFlag theo params.locale
    useEffect(() => {
        if (typeof params.locale === 'string') {
            setDefaultFlag(params.locale);
        }
    }, [params.locale]);

    const handleChangeFlag = (value: string) => {
        console.log(pathname)
        startTransition(()=>{
            router.replace({pathname,params},{locale: value})
        })
    };
    return (
        <Select value={defaultFlag} onValueChange={handleChangeFlag} >
            <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                {locales.map((locale) => (
                    <SelectItem key={locale.value} value={locale.value}>
                        <div className="flex items-center gap-2">
                            <img src={locale.flag} alt={locale.label} className="w-5 h-5" />
                            {locale.label}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}