interface LogoProps {
  className?: string
  color: 'white' | 'blue'
  size: 'pc' | 'sp'
  homeUrl: string
}

const Logo: React.FC<LogoProps> = ({ className = '', color, size, homeUrl }) => {
  return (
    <h1>
      <a href={homeUrl} className={`inline-block ${className}`}>
        {color === 'white' && size === 'pc' && <img src="/images/logo/logo_white_pc.svg" alt="スポカル人材バンク" />}
        {color === 'white' && size === 'sp' && <img src="/images/logo/logo_white_sp.svg" alt="スポカル人材バンク" />}
        {color === 'blue' && size === 'pc' && <img src="/images/logo/logo_blue_pc.svg" alt="スポカル人材バンク" />}
        {color === 'blue' && size === 'sp' && <img src="/images/logo/logo_blue_sp.svg" alt="スポカル人材バンク" />}
      </a>
    </h1>
  )
}

export default Logo
