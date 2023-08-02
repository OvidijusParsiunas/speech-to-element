import npmLogoBlack from './icons/npm-logo-black.png';
import githubLogo from './icons/github-logo.png';
import npmLogoRed from './icons/npm-logo-red.png';
import React from 'react';
import './Header.css';

export default function Header() {
  const [npmLogoPath, setNpmLogoPath] = React.useState(npmLogoBlack);

  return (
    <div id="header" className="header-content">
      <a href="https://www.npmjs.com/package/speech-to-element" target="_blank" rel="noreferrer">
        <img
          id="npm-logo"
          className="header-content"
          src={npmLogoPath}
          onMouseEnter={() => setNpmLogoPath(npmLogoRed)}
          onMouseLeave={() => setNpmLogoPath(npmLogoBlack)}
          alt=""
        />
      </a>
      {/* this is highlighted by native :hover css selector */}
      <a href="https://github.com/OvidijusParsiunas/speech-to-element" target="_blank" rel="noreferrer">
        <img id="github-logo" className="header-content generic-header-logo" src={githubLogo} alt="" />
      </a>
    </div>
  );
}
