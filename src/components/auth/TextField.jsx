const TextField = ({ label, icon: Icon, error, rightElement, ...inputProps }) => (
  <div className="mb-4">
    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <div className="relative">
      {Icon && <Icon className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />}
      <input
        {...inputProps}
        className={`w-full rounded-xl border py-2.5 text-gray-800 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:bg-customDarkSurface dark:text-gray-100 dark:disabled:bg-white/5 dark:disabled:text-gray-500 ${
          Icon ? 'pl-10' : 'pl-4'
        } ${rightElement ? 'pr-10' : 'pr-4'} ${
          error
            ? 'border-red-400 focus:border-red-500'
            : 'border-gray-300 focus:border-customBlue dark:border-white/15'
        }`}
      />
      {rightElement}
    </div>
    {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
  </div>
)

export default TextField
