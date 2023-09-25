import { component$, useSignal } from "@builder.io/qwik";

export default component$(() => {
	const count = useSignal(0);

	return (
		<div>
			Hello Qwik!
			<button
				onClick$={() => {
					console.log("Hello");
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
