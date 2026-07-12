"use client";

/**
 * Noah & Emma — geïllustreerde kindergezichten (SVG)
 * Stijl: flat design, vlakke kleuren, minimale lijnen — geen echte kinderfoto's
 */

export function NoahFace({ size = 200 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Achtergrond */}
      <circle cx="100" cy="100" r="100" fill="#C8E8F8"/>

      {/* Schouders / shirt */}
      <path d="M50 200 C50 178 78 170 100 172 C122 170 150 178 150 200 Z" fill="#4A8FC0"/>

      {/* Nek */}
      <path d="M86 156 C86 168 100 172 114 168 L114 156 Z" fill="#F0BE94"/>

      {/* Oren */}
      <ellipse cx="53" cy="114" rx="8" ry="11" fill="#F5C99E"/>
      <ellipse cx="147" cy="114" rx="8" ry="11" fill="#F5C99E"/>

      {/* Gezicht — vlak, geen gradient */}
      <ellipse cx="100" cy="112" rx="48" ry="50" fill="#F5C99E"/>

      {/* Haar — vlak silhouet */}
      <path d="M52 100 C48 70 68 48 100 48 C132 48 152 70 148 100 C144 86 140 74 128 66 C130 76 128 86 122 92 C120 78 112 66 100 64 C88 66 80 78 78 92 C72 86 70 76 72 66 C60 74 56 86 52 100 Z" fill="#3D2A18"/>
      <path d="M100 64 L98 88" stroke="#2C1D0F" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>

      {/* Wenkbrauwen */}
      <path d="M70 98 C76 94 84 93 90 96" stroke="#3D2A18" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M110 96 C116 93 124 94 130 98" stroke="#3D2A18" strokeWidth="3.5" strokeLinecap="round"/>

      {/* Ogen — simpele stip */}
      <circle cx="82" cy="112" r="5.5" fill="#2A1810"/>
      <circle cx="118" cy="112" r="5.5" fill="#2A1810"/>
      <circle cx="84.5" cy="109.5" r="1.6" fill="white"/>
      <circle cx="120.5" cy="109.5" r="1.6" fill="white"/>

      {/* Neus */}
      <path d="M98 117 C97 121 97 124 100 125" stroke="#D9A876" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>

      {/* Blush */}
      <circle cx="66" cy="129" r="7.5" fill="#F49A82" opacity="0.35"/>
      <circle cx="134" cy="129" r="7.5" fill="#F49A82" opacity="0.35"/>

      {/* Mond — simpele glimlach */}
      <path d="M84 134 C90 143 110 143 116 134" stroke="#B5502E" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M88 136 C93 140.5 107 140.5 112 136 C109 138.5 103 140 100 140 C97 140 91 138.5 88 136 Z" fill="white"/>
    </svg>
  );
}

export function EmmaFace({ size = 200 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Achtergrond */}
      <circle cx="100" cy="100" r="100" fill="#FFE0EC"/>

      {/* Schouders / shirt */}
      <path d="M48 200 C48 176 78 168 100 170 C122 168 152 176 152 200 Z" fill="#FF9EB5"/>

      {/* Staartjes */}
      <path d="M40 108 C28 118 24 138 30 152 C33 158 40 160 42 154 C36 144 36 126 46 114 Z" fill="#C8955A"/>
      <path d="M160 108 C172 118 176 138 170 152 C167 158 160 160 158 154 C164 144 164 126 154 114 Z" fill="#C8955A"/>

      {/* Nek */}
      <path d="M86 154 C86 166 100 170 114 166 L114 154 Z" fill="#FFE4C8"/>

      {/* Oren */}
      <ellipse cx="53" cy="114" rx="8" ry="11" fill="#FFE9CE"/>
      <ellipse cx="147" cy="114" rx="8" ry="11" fill="#FFE9CE"/>

      {/* Gezicht */}
      <ellipse cx="100" cy="112" rx="48" ry="50" fill="#FFE9CE"/>

      {/* Haar boven — vlakke, ronde volume */}
      <path d="M50 96 C44 66 68 46 100 46 C132 46 156 66 150 96 C146 82 140 70 128 64 C130 74 126 84 118 88 C118 74 110 64 100 62 C90 64 82 74 82 88 C74 84 70 74 72 64 C60 70 54 82 50 96 Z" fill="#D9A85E"/>

      {/* Strikje links */}
      <path d="M32 98 C27 91 34 84 40 90 C38 94 35 96 32 98 Z" fill="#FF6B8A"/>
      <path d="M32 98 C27 105 34 112 40 106 C38 102 35 100 32 98 Z" fill="#FF6B8A"/>
      <circle cx="32" cy="98" r="3.5" fill="#FF4070"/>

      {/* Strikje rechts */}
      <path d="M168 98 C173 91 166 84 160 90 C162 94 165 96 168 98 Z" fill="#FF6B8A"/>
      <path d="M168 98 C173 105 166 112 160 106 C162 102 165 100 168 98 Z" fill="#FF6B8A"/>
      <circle cx="168" cy="98" r="3.5" fill="#FF4070"/>

      {/* Wenkbrauwen — fijner voor meisje */}
      <path d="M72 98 C78 94 85 93 90 96" stroke="#8B5E30" strokeWidth="2.8" strokeLinecap="round"/>
      <path d="M110 96 C115 93 122 94 128 98" stroke="#8B5E30" strokeWidth="2.8" strokeLinecap="round"/>

      {/* Ogen */}
      <circle cx="82" cy="112" r="5.5" fill="#2A1810"/>
      <circle cx="118" cy="112" r="5.5" fill="#2A1810"/>
      <circle cx="84.5" cy="109.5" r="1.6" fill="white"/>
      <circle cx="120.5" cy="109.5" r="1.6" fill="white"/>

      {/* Wimpertjes, licht */}
      <path d="M76 106 L74 102" stroke="#2A1810" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M88 106 L90 102" stroke="#2A1810" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M112 106 L110 102" stroke="#2A1810" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M124 106 L126 102" stroke="#2A1810" strokeWidth="1.4" strokeLinecap="round"/>

      {/* Neus */}
      <path d="M98 117 C97 121 97 124 100 125" stroke="#E8B98C" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>

      {/* Blush */}
      <circle cx="66" cy="129" r="8" fill="#FFA8A0" opacity="0.4"/>
      <circle cx="134" cy="129" r="8" fill="#FFA8A0" opacity="0.4"/>

      {/* Mond */}
      <path d="M84 134 C90 144 110 144 116 134" stroke="#D45876" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M88 136 C93 140.5 107 140.5 112 136 C109 138.5 103 140 100 140 C97 140 91 138.5 88 136 Z" fill="white"/>
    </svg>
  );
}
