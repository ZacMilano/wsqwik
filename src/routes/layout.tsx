import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import { Form, routeLoader$, useLocation } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";

import Header from "~/components/starter/header/header";
import Footer from "~/components/starter/footer/footer";

import styles from "./styles.css?inline";
import layoutStyles from "./layout.css?inline";
import { useAuthSession, useAuthSignin, useAuthSignout } from "./plugin@auth";

export const onGet: RequestHandler = async ({ cacheControl }) => {
	// Control caching for this request for best performance and to reduce hosting costs:
	// https://qwik.builder.io/docs/caching/
	cacheControl({
		// Always serve a cached response by default, up to a week stale
		staleWhileRevalidate: 60 * 60 * 24 * 7,
		// Max once every 5 seconds, revalidate on the server to get a fresh version of this page
		maxAge: 5,
	});
};

export const useServerTimeLoader = routeLoader$(() => {
	return {
		date: new Date().toISOString(),
	};
});

export default component$(() => {
	useStyles$(styles);
	useStyles$(layoutStyles);
	const session = useAuthSession();
	const loginAction = useAuthSignin();
	const logoutAction = useAuthSignout();
	const location = useLocation();

	const user = session.value?.user;

	return (
		<>
			<Header />
			{user ? (
				<Form action={logoutAction}>
					{session.value.user?.name}
					<button>Sign Out</button>
					{user.image && <img src={user.image} width={30} height={30} />}
					<span>
						{user.name}({user.email})
					</span>
				</Form>
			) : (
				<Form action={loginAction}>
					<input type="hidden" name="providerId" value="github" />
					<input
						type="hidden"
						name="options.callbackUrl"
						value={location.url.toString()}
					/>
					<button>Sign In</button>
				</Form>
			)}

			<main>
				<Slot />
			</main>
			<Footer />
		</>
	);
});
