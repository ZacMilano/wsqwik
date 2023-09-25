import { component$, useSignal, useTask$ } from "@builder.io/qwik";

export default component$(() => {
	const filter = useSignal("");
	const debouncedFilter = useSignal("");

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
