const PENGUINS = [
  { left: "5%", top: "10%", size: "28px", duration: "14s", delay: "0s", opacity: 0.06 },
  { left: "15%", top: "70%", size: "20px", duration: "18s", delay: "2s", opacity: 0.05 },
  { left: "28%", top: "30%", size: "24px", duration: "12s", delay: "4s", opacity: 0.07 },
  { left: "42%", top: "80%", size: "18px", duration: "16s", delay: "1s", opacity: 0.04 },
  { left: "55%", top: "15%", size: "22px", duration: "15s", delay: "3s", opacity: 0.06 },
  { left: "68%", top: "55%", size: "26px", duration: "13s", delay: "5s", opacity: 0.05 },
  { left: "80%", top: "25%", size: "20px", duration: "17s", delay: "2s", opacity: 0.07 },
  { left: "90%", top: "65%", size: "24px", duration: "11s", delay: "4s", opacity: 0.06 },
  { left: "35%", top: "50%", size: "16px", duration: "19s", delay: "6s", opacity: 0.04 },
  { left: "72%", top: "85%", size: "22px", duration: "14s", delay: "1s", opacity: 0.05 },
]

const ORBS = [
  { left: "15%", top: "20%", size: "300px", color: "rgba(125, 211, 252, 0.04)", duration: "18s", delay: "0s" },
  { left: "65%", top: "60%", size: "350px", color: "rgba(167, 139, 250, 0.035)", duration: "22s", delay: "3s" },
  { left: "40%", top: "75%", size: "280px", color: "rgba(251, 191, 36, 0.03)", duration: "20s", delay: "6s" },
]

export function FloatingPenguins() {
  return (
    <div class="floating-penguins">
      {ORBS.map((orb) => (
        <div
          class="absolute rounded-full animate-float-orb"
          style={{
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            "--orb-duration": orb.duration,
            "animation-delay": orb.delay,
            filter: "blur(40px)",
          }}
        />
      ))}
      {PENGUINS.map((p) => (
        <div
          class="floating-penguin"
          style={{
            left: p.left,
            top: p.top,
            "--size": p.size,
            "--duration": p.duration,
            "--delay": p.delay,
            "--penguin-opacity": p.opacity,
            "font-size": p.size,
          }}
        >
          🐧
        </div>
      ))}
    </div>
  )
}
