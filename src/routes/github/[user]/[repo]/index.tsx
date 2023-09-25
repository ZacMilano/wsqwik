import { component$ } from "@builder.io/qwik";
import {
	Form,
	Link,
	routeAction$,
	routeLoader$,
	useLocation,
	z,
	zod$,
} from "@builder.io/qwik-city";
import type { paths } from "@octokit/openapi-types";
import { createServerClient } from "supabase-auth-helpers-qwik";

type OrgRepoResponse =
	paths["/repos/{owner}/{repo}"]["get"]["responses"]["200"]["content"]["application/json"];

export const useRepository = routeLoader$(async ({ env, params }) => {
	const { user, repo } = params;

	const response = await fetch(`https://api.github.com/repos/${user}/${repo}`, {
		headers: {
			"User-Agent": "Qwik Workshop",
			"X-GitHub-Api-Version": "2022-11-28",
			Authorization: "Bearer " + env.get("PRIVATE_GITHUB_ACCESS_TOKEN"),
		},
	});

	const repository = (await response.json()) as OrgRepoResponse;
	return repository;
});

export const useIsFavorite = routeLoader$(async (requestEv) => {
	const email = requestEv.sharedMap.get("session")?.user?.email as
		| string
		| undefined;
	const user = requestEv.params.user;
	const repo = requestEv.params.repo;
	if (email) {
		const supabaseClient = createServerClient(
			requestEv.env.get("PRIVATE_SUPABASE_URL")!,
			requestEv.env.get("PRIVATE_SUPABASE_ANON_KEY")!,
			requestEv
		);
		const { data: favorite, error } = await supabaseClient
			.from("favorite")
			.select("*")
			.eq("email", email)
			.eq("user", user)
			.eq("repo", repo);

		if (error) {
			console.log("ERROR", error);
			throw error;
		}

		console.log("IS FAVORITE", favorite?.length, email, user, repo);
		return (favorite?.length || 0) > 0;
	}
	return false;
});

export const useSetFavoriteAction = routeAction$(
	async ({ favorite }, requestEv) => {
		const email = requestEv.sharedMap.get("session")?.user?.email as
			| string
			| undefined;
		const user = requestEv.params.user;
		const repo = requestEv.params.repo;
		console.log("SET FAVORITE", favorite, email, user, repo);
		const supabaseClient = createServerClient(
			requestEv.env.get("PRIVATE_SUPABASE_URL")!,
			requestEv.env.get("PRIVATE_SUPABASE_ANON_KEY")!,
			requestEv
		);
		if (email) {
			await supabaseClient
				.from("favorite")
				.delete()
				.eq("email", email)
				.eq("user", user)
				.eq("repo", repo);
		}
		if (favorite && email) {
			await supabaseClient.from("favorite").upsert({
				email,
				user,
				repo,
			});
		}
	},
	zod$({ favorite: z.coerce.boolean() })
);

export default component$(() => {
	const repo = useRepository();
	const location = useLocation();
	const isFavorite = useIsFavorite();
	const setFavoriteAction = useSetFavoriteAction();

	return (
		<div>
			<h3>
				Repository:{" "}
				<Link href={"/github/" + location.params.user}>
					{location.params.user}
				</Link>
				/{location.params.repo}
			</h3>
			<div>
				<b>Repo:</b> {repo.value.name}
				<Form action={setFavoriteAction}>
					<input
						type="hidden"
						name="favorite"
						value={isFavorite.value ? "" : "true"}
					/>

					<button style={{}}>{isFavorite.value ? "★" : "☆"}</button>
				</Form>
			</div>
			<div>
				<b>Description:</b> {repo.value.description}
			</div>
		</div>
	);
});
