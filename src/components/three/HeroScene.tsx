import { Canvas } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import { ParticleField } from './ParticleField';
import { IsabellaOrb } from './IsabellaOrb';

export const HeroScene = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Ambient lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={0.5} />
          
          {/* Stars background */}
          <Stars 
            radius={50} 
            depth={50} 
            count={2000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={0.5}
          />
          
          {/* Particle systems */}
          <ParticleField count={1000} color="#00d4ff" size={0.02} />
          <ParticleField count={300} color="#fbbf24" size={0.025} />
          
          {/* Central Isabella Orb */}
          <Float
            speed={1.5}
            rotationIntensity={0.3}
            floatIntensity={0.4}
          >
            <IsabellaOrb />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
};
