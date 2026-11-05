"use client";
import React from "react";
import { motion } from "motion/react";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: { text: string; image: string; name: string; role: string }[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-2.5 sm:gap-6 pb-2.5 sm:pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-3.5 sm:p-8 rounded-xl sm:rounded-3xl border border-gray-100 shadow-xs sm:shadow-lg shadow-primary/5 max-w-[250px] sm:max-w-xs w-full bg-white transition-all" key={i}>
                  <div className="text-gray-600 leading-snug sm:leading-relaxed text-xs sm:text-base">{text}</div>
                  <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-7 w-7 sm:h-10 sm:w-10 rounded-full grayscale object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col min-w-0">
                      <div className="font-bold tracking-tight leading-tight text-gray-900 text-xs sm:text-sm truncate">{name}</div>
                      <div className="leading-tight text-gray-400 text-[10px] sm:text-xs tracking-tight truncate">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
