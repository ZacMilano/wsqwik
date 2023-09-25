import { component$, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { paths } from "@octokit/openapi-types";

import styles from "./index.css?inline";

type OrgReposResponse =
	paths["/users/{username}/repos"]["get"]["responses"]["200"]["content"]["application/json"];

// "Will never make it to the client" (won't run on client; won't leak secret)
export const useRepositories = routeLoader$(async ({ env, params }) => {
	console.log("Loading repos");

	const response = await fetch(
		`https://api.github.com/users/${params.user}/repos`,
		{
			headers: {
				"User-Agent": "Qwik Workshop",
				"X-GitHub-Api-Version": "2022-11-28",
				Authorization: "Bearer " + env.get("PRIVATE_GITHUB_ACCESS_TOKEN"),
			},
		}
	);
	return (await response.json()) as OrgReposResponse;
});

export default component$(() => {
	const repos = useRepositories();
	const filter = useSignal("");
	useStylesScoped$(styles);

	return (
		<div>
			<input
				value={filter.value}
				onChange$={(e, t) => (filter.value = t.value)}
			/>

			<p>{filter.value}</p>

			<ul class="card-list">
				{repos.value
					.filter((repo) => repo.full_name.indexOf(filter.value) > -1)
					.map((repo) => (
						<li key={repo.full_name} class="card-item">
							<a href={`/github/${repo.full_name}`}>{repo.full_name}</a>
						</li>
					))}
			</ul>
		</div>
	);
});
