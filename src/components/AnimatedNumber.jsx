// src/components/AnimatedNumber.jsx
import { useSpring, animated } from "@react-spring/web";
import { useEffect, useState } from "react";

export default function AnimatedNumber({ value }) {
  const [prev, setPrev] = useState(value);

  const { number } = useSpring({
    from: { number: prev },
    to: { number: value },
    config: { tension: 200, friction: 30 },
    onRest: () => setPrev(value),
  });

  return (
    <animated.span>
      {number.to((n) => Math.floor(n))}
    </animated.span>
  );
}
