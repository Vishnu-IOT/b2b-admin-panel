import '../../styles/button.css';

export default function Button({
  as: As = 'button',
  variant = 'primary',
  size,
  loading = false,
  icon,
  block = false,
  className = '',
  children,
  disabled,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'sm' ? 'btn--sm' : '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <As className={classes} disabled={disabled || loading} {...rest}>
      {loading ? <span className={variant === 'secondary' || variant === 'ghost' || variant === 'danger' ? 'spinner spinner--dark' : 'spinner'} /> : icon}
      {children}
    </As>
  );
}
