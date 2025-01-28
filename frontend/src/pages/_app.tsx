import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import "../globals.css";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<SessionProvider session={session}>
			<Toaster />
			<QueryClientProvider client={queryClient}>
				<main className={inter.className}>
					<Component {...pageProps} />
				</main>
			</QueryClientProvider>
		</SessionProvider>
	);
}
