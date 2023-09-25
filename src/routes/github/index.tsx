import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";

const serverLog = server$(function (...args: unknown[]) {
	console.log.apply(console, args);
});

export default component$(() => {
	// Happens only on the server
	console.log("Render component");

	const filter = useSignal("");
	const debouncedFilter = useSignal("");

	serverLog(1, 2, 3);

	// Running the effect on the server so that we can learn about the tracked
	// value, if it changes. Establishes a connection
	useTask$(({ track }) => {
		const value = track(() => filter.value);
		const id = setTimeout(() => {
			debouncedFilter.value = value;
		}, 400);
		return () => clearTimeout(id);
	});

	return (
		<div>
			Filter:{" "}
			<input
				type="text"
				// equiv to: onInput$={(e, t) => (filter.value = t.value)}
				bind:value={filter}
			/>
			{debouncedFilter.value}
		</div>
	);
});
