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
              value: 300,
              density: {
                enable: true,
                area: 1000,
              },
            },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: {
              value: 0.6,
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.2,
                sync: false,
              },
            },
            size: {
              value: 2,
            },
            move: {
              enable: true,
              speed: 2.5,
              direction: 'bottom',
              random: false,
              straight: true,
              outModes: {
                default: 'out',
                bottom: 'out',
                top: 'out',
              },
            },
            life: {
              duration: {
                value: 8,
              },
            },
            links: {
              enable: false,
            },
          },
          emitters: [
            {
              position: {
                x: 50,
                y: 0,
              },
              rate: {
                delay: 0.05,
                quantity: 3,
              },
              size: {
                width: 60,
                height: 0,
              },
            },
            {
              position: {
                x: 10,
                y: 0,
              },
              rate: {
                delay: 0.08,
                quantity: 2,
              },
              size: {
                width: 20,
                height: 0,
              },
            },
            {
              position: {
                x: 90,
                y: 0,
              },
              rate: {
                delay: 0.08,
                quantity: 2,
              },
              size: {
                width: 20,
                height: 0,
              },
            },
          ],
          background: { color: 'transparent' },
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
