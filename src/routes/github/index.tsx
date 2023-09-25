import {
	Resource,
	component$,
	useResource$,
	useSignal,
	useTask$,
} from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import type { paths } from "@octokit/openapi-types";

type SearchUsersResponse =
	paths["/search/users"]["get"]["responses"]["200"]["content"]["application/json"];

// Easy RPC!
const fetchUsers = server$(async function (query: string) {
	const response = await fetch(
		"https://api.github.com/search/users?q=" + query,
		{
			headers: {
				"User-Agent": "Qwik Workshop",
				"X-GitHub-Api-Version": "2022-11-28",
				Authorization: "Bearer " + this.env.get("PRIVATE_GITHUB_ACCESS_TOKEN"),
			},
		}
	);
	const users = (await response.json()) as SearchUsersResponse;
	return users.items;
});

export default component$(() => {
	const filter = useSignal("");
	const debounceFilter = useSignal("");

	// Running the effect on the server so that we can learn about the tracked
	// value, if it changes. Establishes a connection
	useTask$(({ track }) => {
		const value = track(() => filter.value);
		const id = setTimeout(() => {
			debounceFilter.value = value;
		}, 400);
		return () => clearTimeout(id);
	});

	const users = useResource$(({ track }) => {
		const query = track(() => debounceFilter.value);

		return query ? fetchUsers(query) : [];
	});

	return (
		<div>
			Filter:{" "}
			<input
				type="text"
				// equiv to: onInput$={(e, t) => (filter.value = t.value)}
				bind:value={filter}
			/>
			{debounceFilter.value}
			<Resource
				value={users}
				onPending={() => <div>Loading...</div>}
				onResolved={(users) => (
					<ul>
						{users.map((user) => (
							<li key={user.id}>
								<a href={`/github/${user.login}/`}>{user.login}</a>
							</li>
						))}
					</ul>
				)}
			/>
		</div>
	);
});
