import { component$, useSignal, $ } from "@builder.io/qwik";

export default component$(() => {
	const count = useSignal(0);

	console.log("Rendering", count.value);

	return (
		<div>
			Hello Qwik!
			<button
				onClick$={async () => {
					const fn = $(() => console.log("EXPENSIVE"));
					fn();
				}}
			>
				greet
			</button>
			Count: {count.value}
			<button
				onClick$={() => {
					count.value++;
				}}
			>
				+1
			</button>
		</div>
	);
});
