import React, { forwardRef, useRef, useImperativeHandle, createContext } from 'react'

// Make sure the shape of the default value passed to
// createContext matches the shape that the consumers expect!
const IconContext = createContext({
  contextSize: '',
  className: '',
})

const Button = forwardRef(
  (
    {
      className,
      children,
      danger,
      disabled = false,
      onClick,
      icon,
      iconRight,
      loading = false,
      loadingCentered = false,
      size = 'tiny',
      type = 'primary',
      htmlType,
      ariaSelected,
      ariaControls,
      tabIndex,
      role,
      as,
      textAlign = 'center',
      ...props
    },
    ref
  ) => {
    // button ref
    const containerRef = useRef(null)
    const buttonRef = useRef(null)

    useImperativeHandle(ref, () => ({
      container: () => {
        return containerRef.current
      },
      button: () => {
        return buttonRef.current
      },
    }))

    // styles
    const showIcon = loading || icon

    const buttonContent = (
      <>
        {showIcon &&
          (loading ? (
            <div>IconLoader</div>
          ) : icon ? (
            <IconContext.Provider value={{ contextSize: size }}>
              {icon}
            </IconContext.Provider>
          ) : null)}
        {children && <a>{children}</a>}
        {iconRight && !loading && (
          <IconContext.Provider value={{ contextSize: size }}>
            {iconRight}
          </IconContext.Provider>
        )}
      </>
    )

    if (as) {
      return (
        <span ref={containerRef} className={{}}>
        <div>
            {buttonContent}
          </div>
        </span>
      )
    } else {
      return (
        <span ref={containerRef}>
          <button
            {...props}
            ref={buttonRef}
            disabled={loading || (disabled && true)}
            onClick={onClick}
            type={htmlType}
            aria-selected={ariaSelected}
            aria-controls={ariaControls}
            tabIndex={tabIndex}
            role={role}
          >
            {buttonContent}
          </button>
        </span>
      )
    }
  }
)

export default Button
