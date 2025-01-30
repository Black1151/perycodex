"use client";

import React, { useEffect, useRef } from "react";

const Confetti: React.FC<{ show: boolean }> = ({ show }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiParticles: any[] = [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#FF0000", "#FFC0CB", "#000000", "#FFFFFF"];

    class ConfettiParticle {
      x: number;
      y: number;
      size: number;
      speed: number;
      color: string;
      opacity: number;
      constructor() {
        const canvasWidth = canvas ? canvas.width : 0;
        const canvasHeight = canvas ? canvas.height : 0;
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight - canvasHeight;
        this.size = Math.random() * 8 + 2;
        this.speed = Math.random() * 3 + 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.8 + 0.2;
      }

      update() {
        const canvas = canvasRef.current;
        if (!canvas) return;
        this.y += this.speed;
        if (this.y > canvas.height) {
          this.y = -this.size;
          this.x = Math.random() * canvas.width;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (show) {
      for (let i = 0; i < 200; i++) {
        confettiParticles.push(new ConfettiParticle());
      }

      const animateConfetti = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiParticles.forEach((particle) => {
          particle.update();
          particle.draw(ctx);
        });
        requestAnimationFrame(animateConfetti);
      };

      animateConfetti();

      setTimeout(() => {
        confettiParticles.length = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 3000);
    }
  }, [show]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
};

export default Confetti;
