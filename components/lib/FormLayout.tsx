import React from 'react'

type Props = {
  align?: string
  children?: any
  className?: string
  descriptionText?: string
  error?: string
  id?: string
  label?: string
  labelOptional?: string
  layout?: 'horizontal' | 'vertical'
  style?: React.CSSProperties
  flex?: boolean
  responsive?: boolean
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge'
  beforeLabel?: string
  afterLabel?: string
}

export function FormLayout({
  align,
  children,
  className,
  descriptionText,
  error,
  id,
  label,
  labelOptional,
  layout = 'vertical',
  style,
  flex,
  responsive = true,
  size = 'medium',
  beforeLabel,
  afterLabel,
}: Props) {

  const labelled = Boolean(label || beforeLabel || afterLabel)

  return (
    <div className={{}}>
      {labelled || labelOptional || layout === 'horizontal' ? (
        <div>
          {labelled && (
            <label
              className={{}}
              htmlFor={id}
            >
              {beforeLabel && (
                <span
                  className={{}}
                  id={id + '-before'}
                >
                  {beforeLabel}
                </span>
              )}
              {label}
              {afterLabel && (
                <span
                  className={{}}
                  id={id + '-after'}
                >
                  {afterLabel}
                </span>
              )}
            </label>
          )}
          {labelOptional && (
            <span
              className={{}}
              id={id + '-optional'}
            >
              {labelOptional}
            </span>
          )}
        </div>
      ) : null}
      <div
        className={
          {}
        }
        style={style}
      >
        {children}
        {error && (
          <p className={{}}>{error}</p>
        )}
        {descriptionText && (
          <p
            className={{}}
            id={id + '-description'}
          >
            {descriptionText}
          </p>
        )}
      </div>
    </div>
  )
}
