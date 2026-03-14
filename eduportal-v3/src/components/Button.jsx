import Spinner from './Spinner'

const variantMap = {
  primary:  'btn btn-primary',
  secondary:'btn btn-secondary',
  gold:     'btn btn-gold',
  danger:   'btn btn-danger',
  ghost:    'btn btn-ghost',
  outline:  'btn-outline-forest',
}
const sizeMap = { sm: 'btn-sm', md: '', lg: 'btn-lg', xl: 'btn-xl' }

export default function Button({ children, variant = 'primary', size = 'md', loading, icon, className = '', ...props }) {
  const cls = `${variantMap[variant] || variantMap.primary} ${sizeMap[size]} ${className}`
  return (
    <button className={cls} disabled={loading || props.disabled} {...props}>
      {loading ? <Spinner size="sm" color={variant === 'secondary' || variant === 'ghost' ? 'forest' : 'white'} /> : icon}
      {children}
    </button>
  )
}
