/** @jsxImportSource react */

import React, { useState } from "react";
import { qwikify$ } from "@builder.io/qwik-react";

// React-only
export function GreetReact() {
	return <div>Hello Qwik, from React!</div>;
}

export function CounterReact() {
	const [count, setCount] = useState(0);

	return (
		<button onClick={() => setCount((prev) => prev + 1)}>Count: {count}</button>
	);
}

export function DisplayReact({ value }: { value: number }) {
	return <div>Value: {value}</div>;
}

export function ActionReact({ onClick }: { onClick: () => void }) {
	return <button onClick={onClick}>Click me!</button>;
}

export const Greet = qwikify$(GreetReact);
export const Counter = qwikify$(CounterReact, { eagerness: "hover" });
export const Display = qwikify$(DisplayReact);
export const Action = qwikify$(ActionReact, { eagerness: "hover" });
