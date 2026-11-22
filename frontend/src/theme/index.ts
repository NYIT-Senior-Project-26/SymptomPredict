// Design tokens from the Figma file (page 1). Names match the Figma variables.

/** Raw palette ramps from the "ColorPalette" frame. */
export const palette = {
  grey: {
    100: '#ffffff', 200: '#d6d6d6', 300: '#afafaf', 400: '#898989',
    500: '#656565', 600: '#434343', 700: '#242424',
  },
  secondary: {
    100: '#dfe0e9', 200: '#b6b7cd', 300: '#8e90b1', 400: '#686b95',
    500: '#46496d', 600: '#282a41', 700: '#0f101c',
  },
  tertiary: {
    100: '#dff4fb', 200: '#94e0f2', 300: '#68b9cb', 400: '#50919f',
    500: '#396b76', 600: '#24474f', 700: '#11262b',
  },
  quaternary: {
    100: '#cfdcf0', 200: '#95b6df', 300: '#6691c0', 400: '#4b6c90',
    500: '#324963', 600: '#1a2939', 700: '#09121b',
  },
} as const;

/** Semantic colors used by the DiagnosisCloud components. Prefer these in screens. */
export const colors = {
  brandPrimary: '#396b76',
  brandPrimaryLight: '#e3f2f4',
  /** brandPrimary at 20%, e.g. a selected area on the body map. */
  brandPrimaryTint: 'rgba(57,107,118,0.2)',
  textPrimary: '#1e1e1e',
  textSecondary: '#656565',
  textOnPrimary: '#ffffff',
  /** Label color on the standard Button. */
  buttonLabel: '#f5f5f5',
  bgSurface: '#ffffff',
  /** Light grey fill, e.g. the "Low likelihood" badge. */
  bgMuted: '#f2f3f5',
  /** Inset panels inside cards, e.g. "Why this match" on 3.1 ("bg/canvas" in Figma). */
  bgCanvas: '#f5f7f8',
  /** Backdrop behind a sheet, e.g. the PDF preview on 4.5. */
  bgBackdrop: '#242424',
  borderDefault: '#e3e5e8',
  /** Border of text inputs (TextField). */
  borderField: '#d9d9d9',
  triageGreen: '#2e7d4f',
  triageGreenBg: '#e3f4ea',
  triageYellow: '#a86b00',
  triageYellowBg: '#fff3d6',
  triageRed: '#c62828',
  triageRedBg: '#fde7e7',
} as const;

/** The bordered white card used across screens. Spread it into a style: `{ ...card, gap: 10 }`. */
export const card = {
  padding: 16,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: colors.borderDefault,
  backgroundColor: colors.bgSurface,
} as const;

/** Inter weights used in the design; loaded in app/_layout.tsx. */
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;
