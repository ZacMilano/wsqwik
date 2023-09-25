import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";

export default component$(() => {
	const count = useSignal(0);

	console.log("Rendering", count.value);

	return (
		<div>
			<p>Hello Qwik!</p>

			<button
				onClick$={async () => {
					const fn = server$(() =>
						console.log("Server only, expensive!", count.value)
					);
					fn();
				}}
			>
				greet
			</button>

			<p>Count: {count.value}</p>

			<button
				onClick$={() => {
					count.value++;
				}}
			>
				+1
			</button>

			<Clock />
		</div>
	);
});

export const Clock = component$(() => {
	console.log("Render clock");

	const time = useSignal("loading...");

	useVisibleTask$(() => {
		const update = () => {
			time.value = new Date().toISOString();
		};

		update();
		setInterval(update, 1000);
	});

	return <div>{time.value}</div>;
});
