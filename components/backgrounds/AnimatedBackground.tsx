import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import './AnimatedBackground.css';

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ className = '' }) => {
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: any) => {
    // Particles loaded
  }, []);

  return (
    <div className={`animated-background-container ${className}`}>
      {/* Main centered background image - Planet/Sphere */}
      <div className="background-main">
        <img 
          src="https://framerusercontent.com/images/xdaPXOEtPIASFiIeYk976HyJA.svg?width=1440&height=818" 
          alt="Main background"
          className="background-image"
        />
      </div>

      {/* Left light image */}
      <div className="light-left">
        <img 
          src="https://framerusercontent.com/images/UKLIsmbXPgsNWAAoMY12jQuP2ZI.svg?width=853&height=730" 
          alt="Left light"
          className="light-image"
        />
      </div>

      {/* Right light image */}
      <div className="light-right">
        <img 
          src="https://framerusercontent.com/images/NTKgB6h2Q6llqcAO5km5305uDk0.svg?width=804&height=730" 
          alt="Right light"
          className="light-image"
        />
      </div>

      {/* Main particles - moving from top through sphere to bottom overlay */}
      <Particles
        id="particles-main"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fpsLimit: 120,
          particles: {
            number: {
              value: 280,
              density: {
                enable: false,
              },
            },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: {
              value: { min: 0.15, max: 0.35 },
            },
            size: {
              value: { min: 0.8, max: 1.8 },
            },
            move: {
              enable: true,
              speed: 0.12,
              direction: 'bottom',
              random: false,
              straight: true,
              gravity: {
                enable: false,
              },
              outModes: {
                default: 'destroy',
              },
            },
            links: {
              enable: false,
            },
            spawn: {
              rate: {
                delay: 0.05,
                quantity: 4,
              },
            },
          },
          background: { color: 'transparent' },
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
