import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import './AnimatedBackground.css';

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  className = '',
}) => {
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
              value: 150,
              density: {
                enable: true,
                area: 800,
              },
            },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: {
              value: { min: 0.3, max: 0.7 },
              animation: {
                enable: true,
                speed: 0.5,
                minimumValue: 0.1,
              },
            },
            size: {
              value: { min: 1, max: 2.5 },
            },
            move: {
              enable: true,
              speed: { min: 1.2, max: 2.5 },
              direction: 'bottom',
              random: true,
              straight: false,
              outModes: {
                default: 'out',
                bottom: 'out',
                top: 'out',
              },
            },
            links: {
              enable: false,
            },
          },
          emitters: {
            position: {
              x: 50,
              y: 0,
            },
            rate: {
              delay: 0.1,
              quantity: 5,
            },
            size: {
              width: 100,
              height: 0,
            },
          },
          background: { color: 'transparent' },
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
