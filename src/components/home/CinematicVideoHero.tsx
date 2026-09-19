'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CinematicVideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative h-[85vh] min-h-[580px] w-full overflow-hidden bg-[#020C1B] border-b border-white/10 perspective-container">
      {/* 1. Full-Screen Background Video using HTML5 <video> with mandatory mobile attributes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1600&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-90 transition-all duration-700"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          <source src="/5025864-hd_1920_1080_25fps.mp4" type="video/mp4" />
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-man-in-a-suit-adjusting-his-tie-41584-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* 2. Semi-Transparent Navy Tint Overlay (strictly OVER video, UNDER text) */}
        <div className="absolute inset-0 bg-[#020C1B]/65 backdrop-blur-[1px] z-10"></div>
        
        {/* 3D Ambient Lighting Glow Overlay */}
        <div className="glow-ambient-3d w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"></div>
      </div>

      {/* 3. Hero Overlay Content: Anchored at z-20 (strictly OVER overlay) & Centered with 3D Depth */}
      <div className="relative z-20 max-w-5xl mx-auto h-full flex flex-col items-center justify-center text-center pb-24 md:pb-32 -mt-6 px-4 md:px-8 space-y-6 preserve-3d float-3d">
        <div className="space-y-4 max-w-3xl flex flex-col items-center preserve-3d">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] uppercase tracking-[0.35em] font-medium shadow-2xl layer-depth-1 shimmer-3d">
            <span>PREMIUM READY-TO-WEAR LUXURY</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-tight uppercase leading-[1.1] hero-3d-title layer-depth-2">
            J. VELORIA
            <span className="block font-light italic text-slate-300 text-xl md:text-3xl normal-case tracking-normal mt-1">
              Luxury Ready-to-Wear
            </span>
          </h1>

          <p className="text-xs md:text-sm text-slate-300 max-w-xl font-light leading-relaxed drop-shadow-lg layer-depth-1">
            Discover our exclusive ready-to-wear menswear collection, featuring premium trousers, elegant shirts, and finely crafted footwear.
          </p>
        </div>

        {/* Centered Call to Actions with 3D Dynamic Lift */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 layer-depth-3 preserve-3d">
          <Link
            href="/clothes"
            className="px-8 py-4 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-all duration-300 flex items-center gap-2 shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(255,255,255,0.25)] hover:-translate-y-1 transform-gpu"
          >
            Explore Ready-to-Wear Clothes <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/shoes"
            className="px-8 py-4 bg-transparent border border-white/80 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/15 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:border-white hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)] hover:-translate-y-1 transform-gpu backdrop-blur-sm"
          >
            Explore Footwear Hub
          </Link>
        </div>
      </div>
    </section>
  );
}
