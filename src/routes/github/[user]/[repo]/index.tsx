import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$, useLocation } from "@builder.io/qwik-city";
import type { paths } from "@octokit/openapi-types";

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

export default component$(() => {
	const repo = useRepository();
	const location = useLocation();

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
			</div>
			<div>
				<b>Description:</b> {repo.value.description}
			</div>
		</div>
	);
});
