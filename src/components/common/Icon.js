const PATHS = {
  menu: 'M4 7h16M4 12h16M4 17h16',
  x: 'M18 6 6 18M6 6l12 12',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35',
  bell: 'M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9',
  plus: 'M12 5v14M5 12h14',
  edit: 'm16.5 3.5 4 4L8 20l-4.5 1L4.5 16.5 16.5 3.5Z',
  trash: 'M4 7h16M9 7V4h6v3m-1 0v13H10V7m-3 0v13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  check: 'M20 6 9 17l-5-5',
  checkCircle: 'M22 11.1V12a10 10 0 1 1-5.9-9.1 M22 4 12 14.01l-3-3',
  chevronLeft: 'm15 18-6-6 6-6',
  chevronRight: 'm9 18 6-6-6-6',
  chevronDown: 'm6 9 6 6 6-6',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
  upload: 'M12 16V4m0 0 4 4m-4-4-4 4 M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3',
  image: 'M3 5h18v14H3V5Zm4 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM3 16l5-5 4 4 3-3 6 6',
  video: 'm10 9 5 3-5 3V9Z M3 5h18v14H3V5Z',
  fileText: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-5Z M14 3v5h5 M9 13h6M9 17h6M9 9h1',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  building: 'M3 21h18 M6 21V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v17 M14 21V9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v12 M9 7h1M9 11h1M9 15h1',
  layout: 'M3 3h18v18H3V3Z M3 9h18 M9 21V9',
  message: 'M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1L3 20l1-4.5a8.5 8.5 0 1 1 17-4Z',
  help: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4 M12 17h.01',
  folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z',
  package: 'M21 8 12 3 3 8l9 5 9-5Z M3 8v9l9 5 9-5V8 M12 13v9',
  award: 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z M8.2 13.9 7 22l5-3 5 3-1.2-8.1',
  inbox: 'M22 12h-6l-2 3h-4l-2-3H2 M5.5 5h13l3.5 7v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7l3.5-7Z',
  briefcase: 'M4 7h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M2 12h20',
  alertCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 8v5 M12 16h.01',
  shield: 'M12 2 4 5v6c0 5.2 3.4 9 8 11 4.6-2 8-5.8 8-11V5l-8-3Z',
  file: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-5Z M14 3v5h5',
  play: 'M6 3.5 20 12 6 20.5V3.5Z',
  externalLink: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14 21 3',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 6v6l4 2',
  trendingUp: 'm23 6-9.5 9.5-5-5L1 18 M17 6h6v6',
  mapPin: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 3a2 2 0 0 1-.5 2.1L8 10.1a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .7a2 2 0 0 1 1.6 2Z',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z M22 6l-10 7L2 6',
  globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M2 12h20 M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z',
  lock: 'M5 11h14v10H5V11Z M8 11V7a4 4 0 1 1 8 0v4',
  thumbsUp: 'M7 22V11l4-9 1.5 1a2 2 0 0 1 1 2.2L12 9h6.3a2 2 0 0 1 2 2.4l-1.6 8A2 2 0 0 1 16.7 21H7Z',
  filter: 'M22 3H2l8 9.5V19l4 2v-8.5L22 3Z',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 16v-4 M12 8h.01',
};

export default function Icon({ name, size = 18, strokeWidth = 2, className = '', ...rest }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}
