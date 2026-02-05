import { motion } from 'framer-motion';

interface AztecBackgroundProps {
  variant?: 'calendar' | 'quetzalcoatl' | 'pattern' | 'subtle';
  opacity?: number;
  className?: string;
}

export const AztecBackground = ({ 
  variant = 'calendar', 
  opacity = 0.03,
  className = '' 
}: AztecBackgroundProps) => {
  
  // Aztec Calendar (Piedra del Sol) SVG Pattern
  const CalendarPattern = () => (
    <svg
      viewBox="0 0 400 400"
      className="w-full h-full"
      style={{ opacity }}
    >
      {/* Outer Ring */}
      <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="1" />
      
      {/* Second Ring with Aztec glyphs */}
      <circle cx="200" cy="200" r="160" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i * 18) * (Math.PI / 180);
        const x = 200 + 170 * Math.cos(angle);
        const y = 200 + 170 * Math.sin(angle);
        return (
          <g key={i} transform={`translate(${x}, ${y}) rotate(${i * 18 + 90})`}>
            <path
              d="M-5,-8 L0,-12 L5,-8 L5,8 L0,12 L-5,8 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </g>
        );
      })}
      
      {/* Inner rings */}
      <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="1.5" />
      
      {/* 20 day signs ring */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i * 18 - 90) * (Math.PI / 180);
        const x = 200 + 130 * Math.cos(angle);
        const y = 200 + 130 * Math.sin(angle);
        return (
          <g key={`day-${i}`} transform={`translate(${x}, ${y})`}>
            <rect x="-8" y="-8" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="0.5" rx="2" />
            <circle cx="0" cy="0" r="3" fill="currentColor" fillOpacity="0.3" />
          </g>
        );
      })}
      
      {/* Third ring */}
      <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="1" />
      
      {/* 8 cardinal triangles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 - 90) * (Math.PI / 180);
        const x1 = 200 + 80 * Math.cos(angle);
        const y1 = 200 + 80 * Math.sin(angle);
        const x2 = 200 + 100 * Math.cos(angle - 0.2);
        const y2 = 200 + 100 * Math.sin(angle - 0.2);
        const x3 = 200 + 100 * Math.cos(angle + 0.2);
        const y3 = 200 + 100 * Math.sin(angle + 0.2);
        return (
          <polygon
            key={`tri-${i}`}
            points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
            fill="currentColor"
            fillOpacity="0.1"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        );
      })}
      
      {/* Inner sacred geometry */}
      <circle cx="200" cy="200" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="50" fill="none" stroke="currentColor" strokeWidth="1" />
      
      {/* Four directions */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i * 90 - 45) * (Math.PI / 180);
        const x = 200 + 60 * Math.cos(angle);
        const y = 200 + 60 * Math.sin(angle);
        return (
          <g key={`dir-${i}`} transform={`translate(${x}, ${y}) rotate(${i * 90})`}>
            <path
              d="M0,-15 L10,0 L0,15 L-10,0 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </g>
        );
      })}
      
      {/* Center - Tonatiuh (Sun God) face simplified */}
      <circle cx="200" cy="200" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="200" cy="200" r="20" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1" />
      
      {/* Sun rays from center */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45) * (Math.PI / 180);
        return (
          <line
            key={`ray-${i}`}
            x1={200 + 22 * Math.cos(angle)}
            y1={200 + 22 * Math.sin(angle)}
            x2={200 + 28 * Math.cos(angle)}
            y2={200 + 28 * Math.sin(angle)}
            stroke="currentColor"
            strokeWidth="1.5"
          />
        );
      })}
    </svg>
  );

  // Quetzalcoatl (Feathered Serpent) Pattern
  const QuetzalcoatlPattern = () => (
    <svg
      viewBox="0 0 200 400"
      className="w-full h-full"
      style={{ opacity }}
    >
      {/* Serpent body - wavy pattern */}
      <path
        d="M100,20 
           C140,60 60,100 100,140 
           C140,180 60,220 100,260 
           C140,300 60,340 100,380"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      
      {/* Feathers along the body */}
      {Array.from({ length: 12 }).map((_, i) => {
        const y = 40 + i * 28;
        const xOffset = i % 2 === 0 ? 20 : -20;
        return (
          <g key={i}>
            <path
              d={`M${100 + xOffset},${y} Q${100 + xOffset * 2},${y - 10} ${100 + xOffset * 2.5},${y}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d={`M${100 + xOffset},${y} Q${100 + xOffset * 2},${y + 10} ${100 + xOffset * 2.5},${y}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </g>
        );
      })}
      
      {/* Serpent head */}
      <circle cx="100" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="95" cy="15" r="3" fill="currentColor" fillOpacity="0.5" />
      <circle cx="105" cy="15" r="3" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );

  // Geometric Pattern (Grecas)
  const GeometricPattern = () => (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      style={{ opacity }}
    >
      <defs>
        <pattern id="aztec-greca" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          {/* Step pattern - Greca */}
          <path
            d="M0,25 L12.5,25 L12.5,12.5 L25,12.5 L25,0 L37.5,0 L37.5,12.5 L50,12.5 L50,25 L37.5,25 L37.5,37.5 L25,37.5 L25,50 L12.5,50 L12.5,37.5 L0,37.5 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          {/* Center diamond */}
          <path
            d="M25,15 L35,25 L25,35 L15,25 Z"
            fill="currentColor"
            fillOpacity="0.1"
            stroke="currentColor"
            strokeWidth="0.3"
          />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#aztec-greca)" />
    </svg>
  );

  const patterns = {
    calendar: CalendarPattern,
    quetzalcoatl: QuetzalcoatlPattern,
    pattern: GeometricPattern,
    subtle: GeometricPattern,
  };

  const effectiveOpacity = variant === 'subtle' ? 0.015 : opacity;
  const Pattern = patterns[variant] || patterns.pattern;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className={`fixed inset-0 pointer-events-none overflow-hidden text-primary ${className}`}
      style={{ zIndex: 0, opacity: effectiveOpacity / opacity }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[800px] h-[800px] animate-spin-slow">
          <Pattern />
        </div>
      </div>
    </motion.div>
  );
};

// Export individual patterns for flexible use
export const AztecCalendar = ({ opacity = 0.03 }: { opacity?: number }) => (
  <AztecBackground variant="calendar" opacity={opacity} />
);

export const AztecQuetzalcoatl = ({ opacity = 0.03 }: { opacity?: number }) => (
  <AztecBackground variant="quetzalcoatl" opacity={opacity} />
);

export const AztecGreca = ({ opacity = 0.03 }: { opacity?: number }) => (
  <AztecBackground variant="pattern" opacity={opacity} />
);
