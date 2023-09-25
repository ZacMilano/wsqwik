import { component$, useSignal } from "@builder.io/qwik";

import { Counter, Greet, Action, Display } from "./react";

export default component$(() => {
	const count = useSignal(0);

	return (
		<div>
			Hello Qwik!
			<Greet />
			<Counter />
			<Action
				onClick$={() => {
					count.value += 1;
				}}
			/>
			<Display value={count.value} />
		</div>
	);
});
