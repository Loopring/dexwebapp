import React from 'react';

const TickerBarStatusIcon = () => (
  <svg width="15px" height="9px" viewBox="0 0 10 6">
    <defs>
      <linearGradient
        x1="0%"
        y1="-21.957624%"
        x2="100%"
        y2="100%"
        id="linearGradient-1"
      >
        <stop stopColor="#00AEF3" offset="0%"></stop>
        <stop stopColor="#3750FF" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g id="控件" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g
        id="选择"
        transform="translate(-230.000000, -23.000000)"
        fill="url(#linearGradient-1)"
      >
        <g id="编组-2">
          <g transform="translate(8.000000, 13.000000)">
            <g
              id="Icon/right-Arrow"
              transform="translate(227.000000, 11.000000) rotate(-270.000000) translate(-227.000000, -11.000000) translate(223.500000, 6.000000)"
            >
              <g
                transform="translate(3.500000, 5.000000) rotate(-270.000000) translate(-3.500000, -5.000000) translate(-1.000000, 2.000000)"
                id="Icon/Up-Arrow"
              >
                <path d="M0.120616938,5.13596683 L4.1871372,0.18512069 C4.36855783,-0.0357525857 4.68889497,-0.0628236186 4.90263022,0.124655845 C4.92605459,0.145202709 4.9476254,0.167904898 4.96707703,0.192482859 L8.88530375,5.143329 C9.06278977,5.36759014 9.03074631,5.69807569 8.81373269,5.88148914 C8.72305225,5.95812954 8.60951179,6 8.49236581,6 L0.50761884,6 C0.227268696,6 0,5.76514131 0,5.47542843 C0,5.35107753 0.0427473669,5.23077031 0.120616938,5.13596683 Z"></path>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default TickerBarStatusIcon;
