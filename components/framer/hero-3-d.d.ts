import { FC } from 'react';

interface Hero3DProps {
  variant?: 'DsgFqezgd' | 'xtAXTJniB' | 'T4ozjHGsu';
}

interface Hero3DComponent extends FC<Hero3DProps> {
  Responsive: FC<Omit<Hero3DProps, 'variant'>>;
}

declare const Hero3D: Hero3DComponent;

export default Hero3D;
