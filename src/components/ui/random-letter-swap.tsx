import { useState } from "react";
import { motion } from "framer-motion";

export const RandomLetterSwap = ({
  label,
  className,
  staggerDuration = 0.025,
  transition = { duration: 0.6, type: "spring" },
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const letters = label.split("");

  return (
    <motion.button
      className={className}
      {...props}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ rotate: 0 }}
          animate={{ rotate: isHovered ? [0, 360] : 0 }}
          transition={{
            ...transition,
            delay: index * staggerDuration,
          }}
          className="inline-block"
        >
          {letter}
        </motion.span>
      ))}
    </motion.button>
  );
};
