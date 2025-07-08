import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import SessionWrapper from "./components/sessionWrapper";
import InitialPageLoader from "./components/InitialPageLoader";


export default async function MainLayout({
                                            children,
                                            params,
                                          }: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
      <NextIntlClientProvider>
          <SessionWrapper>
              <InitialPageLoader/>
              {children}
          </SessionWrapper>
      </NextIntlClientProvider>
  );
}
