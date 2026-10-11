export default function LogoCA({ width = "120px", height = "auto" }) {
  return (
    <div style={{ display: 'inline-block', width, height, verticalAlign: 'middle' }}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 160 80" 
        width="100%" 
        height="100%"
      >
        <style>{`
          .bg-pill {
            fill: #127abb;
          }
          .brand-text {
            font-family: 'Arial', Times, serif, Georgia;
            font-weight: bold;
            font-size: 36px;
            fill: #ffffff;
            text-anchor: middle;
            dominant-baseline: central;
            letter-spacing: 2px;
          }
        `}</style>

        {}
        <rect x="10" y="10" width="140" height="60" rx="20" ry="100" className="bg-pill" />

        {}
        <text x="80" y="42" className="brand-text">CA</text>
      </svg>
    </div>
  );
}