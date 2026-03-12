// constants/theme.ts
// ═══════════════════════════════════════════════════════════════
// DESIGN SYSTEM — one file to rule all visual tokens.
// Change a value here → updates everywhere instantly.
// ═══════════════════════════════════════════════════════════════

export const Colors = {
  // Canvas - Modern Pink Gradient Background
  bg: "#1a0a14",
  bgCard: "rgba(236, 102, 149, 0.06)",

  // Glass surfaces
  glass: "rgba(255, 255, 255, 0.08)",
  glassInput: "rgba(255, 255, 255, 0.12)",

  // Brand Pink
  pink: "#FF6B9D",
  pinkLight: "#FFB8CC",
  pinkPale: "rgba(255, 107, 157, 0.15)",
  pinkGlow: "rgba(255, 107, 157, 0.25)",

  // Pink Gradient Colors
  gradientStart: "#FF6B9D",
  gradientEnd: "#C44569",
  gradientMid: "#F77F00",

  // Borders
  border: "rgba(255, 182, 193, 0.3)",
  borderPink: "rgba(255, 107, 157, 0.5)",
  borderError: "rgba(255, 80, 80, 0.65)",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.6)",
  textError: "#ff5050",
  textPink: "#FFB8CC",

  white: "#FFFFFF",
  black: "#000000",
} as const;

export const Fonts = {
  // Swap "Georgia" with "Playfair Display" after adding via expo-font
  display: "Georgia",
  // Swap "System" with "DM Sans" for a refined body typeface
  body: "System",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 36,
  xxl: 52,
} as const;

export const Radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
} as const;

export const Shadow = {
  card: {
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 14,
  },
  pink: {
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;

// Gradient configurations
export const Gradients = {
  primary: ["#FF6B9D", "#C44569"],
  background: ["#1a0a14", "#2d0f1f", "#1a0a14"],
  button: ["#FF6B9D", "#E85A8A"],
  card: ["rgba(255, 107, 157, 0.1)", "rgba(196, 69, 105, 0.05)"],
} as const;

