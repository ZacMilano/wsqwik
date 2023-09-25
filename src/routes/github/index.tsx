import type { QRL } from "@builder.io/qwik";
import {
	component$,
	useSignal,
	useTask$,
	implicit$FirstArg,
} from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";

const serverLog = server$(function (...args: unknown[]) {
	console.log.apply(console, args);
});

// "QRL is Qwik URL, qute"
export const demoQrl = async (fn: QRL<() => string>) => {
	// Can use useTask$ if demo$ is used within a component$ !
	console.log(await fn());
};

export const demo$ = implicit$FirstArg(demoQrl);

export default component$(() => {
	demo$(() => "abc");

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
