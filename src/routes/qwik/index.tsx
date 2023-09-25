import { component$, useSignal } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";

export default component$(() => {
	const count = useSignal(0);

	console.log("Rendering", count.value);

	return (
		<div>
			Hello Qwik!
			<button
				onClick$={async () => {
					const fn = server$(() => console.log("Server only"));
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
