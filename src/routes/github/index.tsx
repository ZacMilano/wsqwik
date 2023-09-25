import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { type RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ json, request }) => {
	// Can set up an API and HTML at the same endpoint!
	console.log(request.headers.get("Accept"));
	if (request.headers.get("Accept")?.indexOf("application/json")) {
		json(200, { body: "Hello Qwik!" });
	}
};

export default component$(() => {
	const filter = useSignal("");
	const debouncedFilter = useSignal("");

	useTask$(({ track, cleanup }) => {
		track(filter);
		const id = setTimeout(() => (debouncedFilter.value = filter.value), 400);
		cleanup(() => clearTimeout(id));
	});

	return (
		<div>
			Filter:{" "}
			<input
				type="text"
				// equiv to: onInput$={(e, t) => (filter.value = t.value)}
				bind:value={filter}
			/>
			{filter.value}
		</div>
	);
});
