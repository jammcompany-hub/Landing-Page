"use client";

import Image from "next/image";
import SignupFormDemo from "@/components/signup-form-demo";
import { FlipWords } from "@/components/ui/flip-words";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { Box, CalendarRange, Clock, Globe2, GraduationCap, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";


export default function Home() {
  const words = ["Time.", "Community."];

  const meetTheTeam = [
    {
      quote:
        "Jamm has revolutionized how we coordinate our prayers. The AI-driven recommendations are spot on!",
      name: "Yusuf Allam",
      designation: "Founder of Jamm App, Bachelor's in MIS &. A.I.",
      src: "/yusufpic.jpeg",
    },
    {
      quote:
        "This app has transformed the way we coordinate our prayers. It's user-friendly and efficient.",
      name: "Shah Qureshi",
      designation: "Co-founder of Jamm App, Graduate from CCSU",
      src: "/shahpic.jpg",
    },
    {
      quote:
        "As a student, Jamm has made it incredibly easy to find prayer times that fit my busy schedule.",
      name: "Kareem Ghonaim",
      designation: "Co-founder of Jamm App, M.S. in Computer Science",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  interface GridItemProps {
    area: string;
    icon: React.ReactElement;
    title: string;
    description: React.ReactNode;
  }

  const testimonials1 = [
    {
      quote:
        "Right now we’re always texting back and forth trying to set a time. This would save so much time.",
      name: "Aya Modni",
      title: "Undergraduate at CCSU",
      // image: "/ccsupic.PNG",
    },
    {
      quote:
        "Most days I just end up praying by myself between classes. An app like this would help a lot.",
      name: "Ahmed Gooda",
      title: "Undergraduate at CCSU",
      // image: "/ccsupic.PNG",
    },
    {
      quote:
        "Balancing classes and prayers is hard. Something like this would help keep me on track",
      name: "Rahid Ahmed",
      title: "Undergraduate at CCSU",
      // image: "/ccsupic.PNG",
    },
    {
      quote:
        "I think this could bring people together in a way we don’t really have right now.",
      name: "Mariam Khalil",
      title: "Undergraduate at CCSU",
      // image: "/ccsupic.PNG",
    },
    {
      quote:
        "Honestly, it would just make group prayer so much easier to plan.",
      name: "Mahmoud Omar",
      title: "Undergraduate at CCSU",
      // image: "/ccsupic.PNG",
    },
  ];
  
  const GridItem = ({ area, icon, title, description }: GridItemProps) => {
    return (
      <li className={`min-h-[14rem] list-none ${area}`}>
        <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
            <div className="relative flex flex-1 flex-col justify-between gap-3">
              <div className="w-fit rounded-lg border border-gray-600 p-2">
                {/* Icon in white */}
                {React.cloneElement(icon as React.ReactElement<any>, {
                  className: "h-4 w-4 text-white",
                })} 
              </div>
              <div className="space-y-3">
                {/* Title in gold */}
                <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-[#FFE066] md:text-2xl/[1.875rem]">
                  {title}
                </h3>
                {/* Description in white */}
                <h2 className="font-sans text-sm/[1.125rem] text-white md:text-base/[1.375rem] [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                  {description}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0B0B45] to-[#1E3ECF] relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-400 opacity-20 blur-3xl rounded-full"></div>
      <Image
        className="mt-50"
        src="/svg 3.png"
        alt="Next.js logo"
        width={400}
        height={120}
        priority
      />
      <div className="mt-6 flex justify-center items-center px-4">
        <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
          <span className="text-white">Find</span>
          <FlipWords words={words} className="text-[#FFE066] font-bold" />{" "}
          <br />
          <span className="text-white">built around you</span>
        </div>
      </div>

      <ul className="mx-auto my-8 w-full max-w-4xl rounded-3xl bg-white/5 p-6 shadow-xl grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-2">
        <GridItem
          area="md:[grid-area:1/1/2/7]"
          icon={<Clock className="h-4 w-4 text-black dark:text-neutral-400" />}
          title="The Problem"
          description="Muslim students struggle to find overlapping times to pray together."
        />

        <GridItem
          area="md:[grid-area:1/7/2/13]"
          icon={
            <CalendarRange className="h-4 w-4 text-black dark:text-neutral-400" />
          }
          title="Our Solution"
          description="Jamm analyze schedules and recommedns the best times for group prayers."
        />

        <GridItem
          area="md:[grid-area:2/1/3/7]"
          icon={
            <GraduationCap className="h-4 w-4 text-black dark:text-neutral-400" />
          }
          title="Who It's For"
          description="Designed for Muslim students attending CCSU."
        />

        <GridItem
          area="md:[grid-area:2/7/3/13]"
          icon={<Globe2 className="h-4 w-4 text-black dark:text-neutral-400" />}
          title="Mission"
          description="Building stronger faith and community, expanding from campus to everywhere."
        />
      </ul>

      <div id="recommendations">
        <AnimatedTestimonials testimonials={meetTheTeam} />
      </div>

      <div className="">
        <InfiniteMovingCards
          items={testimonials1}
          direction="right"
          speed="slow"
        />
      </div>

      <div className="mt-10">
        <SignupFormDemo />
      </div>
    </div>
  );
}
