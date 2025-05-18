import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";

import { AppContextProvider } from "@client/components/AppContextProvider";
import { Main } from "@client/components/Main";
import { assertGetElementById, registerServiceWorker } from "@client/helpers/browser";

registerServiceWorker().catch(console.error);

const root = assertGetElementById("root");
createRoot(root).render(
	<QueryClientProvider client={new QueryClient()}>
		<AppContextProvider>
			<Main />
		</AppContextProvider>
	</QueryClientProvider>
);
