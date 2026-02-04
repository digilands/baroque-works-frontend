import { motion } from "framer-motion";

const TechnicalCircuit = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="circuit"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            {/* The Animated Path */}
            <motion.path
              d="M0 100 L100 0 M25 100 L100 25"
              fill="none"
              stroke="#fb923c"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
            {/* The "Power Pulse" Dot */}
            <motion.circle
              cx="0"
              cy="0"
              r="2"
              fill="#38bdf8"
              animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>
    </div>
  );
};

export default TechnicalCircuit;
