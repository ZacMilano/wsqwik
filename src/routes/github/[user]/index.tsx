import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

export const useRepositories = routeLoader$(async () => {
	console.log("Loading repos");
	return ["abc", "xyz"];
});

export default component$(() => {
	const repos = useRepositories();

	return (
		<div>
			<ul>
				{repos.value.map((repo, idx) => (
					<li key={idx}>{repo}</li>
				))}
			</ul>
		</div>
	);
});
