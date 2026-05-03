import { motion } from "motion/react"
import type { HTMLMotionProps } from "motion/react"
import type { ReactNode } from "react"

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  direction?: "up" | "down" | "left" | "right" | "none"
  delay?: number
  duration?: number
  distance?: number
}

export const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 30,
  ...props
}: ScrollRevealProps) => {
  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { y: distance }
      case "down": return { y: -distance }
      case "left": return { x: distance }
      case "right": return { x: -distance }
      default: return { x: 0, y: 0 }
    }
  }

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...getInitialPosition() 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98] // Smooth cubic-bezier
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
