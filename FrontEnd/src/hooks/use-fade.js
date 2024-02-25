import { useState, useEffect } from "react";

import "src/theme/use-fade.css";

const useFade = (initial) => {
	// show is controlling the CSS animation
	const [show, setShow] = useState(initial);

	// isVisible is exposed to the component (toggled after animation)
	const [isVisible, setVisible] = useState(show);

	// Update visibility when show changes
	useEffect(() => {
		if (show) setVisible(true);
	}, [show]);

	// These props go on the fading DOM element
	const fromProps = {
		style: { animation: `${show ? "fadeIn" : "fadeOut"} 1s` },
		onAnimationEnd: () => !show && setVisible(false)
	};

	const toProps = {
		style: { animation: `${show ? "fadeOut" : "fadeIn"} 1s` },
		onAnimationEnd: () => show && setVisible(true)
	};

	return [isVisible, setShow, fromProps, toProps];
};

export default useFade;
