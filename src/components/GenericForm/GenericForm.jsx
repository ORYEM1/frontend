import { useMemo, useState } from 'react'
import './GenericForm.css'
import Footer from "../Footer/Footer.jsx";

const NATIVE_INPUT_TYPES = new Set([
  'text',
  'email',
  'password',
  'number',
  'date',
  'datetime-local',
  'time',
  'tel',
  'url',
  'search',
  'color',
  'file',
])

const DEFAULT_TITLE = 'Dynamic Form'

function resolveFields(requestContext) {
  if (Array.isArray(requestContext)) {
    return requestContext
  }

  if (!requestContext || typeof requestContext !== 'object') {
    return []
  }

  const schema = requestContext.schema || requestContext

  if (Array.isArray(schema)) {
    return schema
  }

  if (!schema || typeof schema !== 'object') {
    return []
  }

  const candidates = [schema.fields, schema['form-data'], schema.formData, schema.data]

  return candidates.find(Array.isArray) || []
}

function normalizeName(label = 'field') {
  return String(label)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function isNameLikeField(field) {
  const normalized = normalizeName(field.name || field.label || '')
  return normalized.includes('name')
}

function isNumericField(field) {
  const type = String(field.type || '').toLowerCase()
  const validationType = String(field.validation?.type || '').toLowerCase()

  return type === 'number' || validationType === 'number' || Boolean(field.validation?.numeric)
}

function isEmailField(field) {
  const type = String(field.type || '').toLowerCase()
  const validationType = String(field.validation?.type || '').toLowerCase()

  return type === 'email' || validationType === 'email' || Boolean(field.validation?.email)
}

function sanitizeNumericValue(value) {
  return String(value).replace(/[^0-9]/g, '')
}

function sanitizeWhitespaceValue(value) {
  return String(value).trim().replace(/\s+/g, '')
}

function sanitizeEmailValue(value) {
  return sanitizeWhitespaceValue(value)
}

function sanitizeNameValue(value) {
  return sanitizeWhitespaceValue(value)
}

function sanitizeFieldValue(field, value) {
  if (isNumericField(field)) {
    return sanitizeNumericValue(value)
  }

  if (isEmailField(field)) {
    return sanitizeEmailValue(value)
  }

  if (isNameLikeField(field)) {
    return sanitizeNameValue(value)
  }

  if (['text', 'email', 'password', 'search', 'tel', 'url', 'textarea'].includes(String(field.type || '').toLowerCase())) {
    return sanitizeWhitespaceValue(value)
  }

  return value
}

function getFieldError(field, value) {
  const label = field.label || 'This field'

  if (field.required) {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return `${label} is required.`
      }

      return ''
    }

    if (typeof value === 'boolean') {
      return value ? '' : `${label} is required.`
    }

    if (!String(value || '').trim()) {
      return `${label} is required.`
    }
  }

  if (isNumericField(field) && String(value || '').trim() && !/^[0-9]+$/.test(String(value))) {
    return `${label} must contain numbers only.`
  }

  if (isEmailField(field) && String(value || '').trim() && /\s/.test(String(value))) {
    return `${label} must not contain spaces.`
  }

  if (field['min-length'] && String(value || '').length < Number(field['min-length'])) {
    return `${label} must be at least ${field['min-length']} characters.`
  }

  if (field['max-length'] && String(value || '').length > Number(field['max-length'])) {
    return `${label} must be no more than ${field['max-length']} characters.`
  }

  return ''
}

function createInitialValues(fields) {
  return fields.reduce((acc, field, index) => {
    const name = field.name || normalizeName(field.label || `field_${index + 1}`)
    const lowerType = String(field.type || 'text').toLowerCase()

    if (lowerType === 'checkbox' && Array.isArray(field.options) && field.options.length > 0) {
      acc[name] = []
      return acc
    }

    acc[name] = lowerType === 'checkbox' ? false : ''
    return acc
  }, {})
}

function createFormSignature(fields) {
  return fields
    .map((field, index) => {
      const name = field.name || normalizeName(field.label || `field_${index + 1}`)
      return `${name}:${field.type || 'text'}`
    })
    .join('|')
}

function GenericForm({
  title = DEFAULT_TITLE,
  submitLabel = 'Submit Form',
  loading = false,
  error = '',
  requestContext = {},
  onSubmit,
}) {
  const resolvedTitle = requestContext?.title || title || DEFAULT_TITLE
  const resolvedFields = useMemo(() => resolveFields(requestContext), [requestContext])
  const country = requestContext?.country || 'unknown'
  const formSignature = useMemo(() => createFormSignature(resolvedFields), [resolvedFields])
  const initialFormValues = useMemo(() => createInitialValues(resolvedFields), [resolvedFields])

  const [formState, setFormState] = useState(() => ({
    signature: formSignature,
    values: initialFormValues,
    errors: {},
    submittedData: null,
  }))

  const isCurrentFormState = formState.signature === formSignature
  const formValues = isCurrentFormState ? formState.values : initialFormValues
  const fieldErrors = isCurrentFormState ? formState.errors : {}
  const submittedData = isCurrentFormState ? formState.submittedData : null

  const updateFormState = (updater) => {
    setFormState((prev) => {
      const currentState =
        prev.signature === formSignature
          ? prev
          : {
              signature: formSignature,
              values: initialFormValues,
              errors: {},
              submittedData: null,
            }

      return updater(currentState)
    })
  }

  const handleFieldChange = (field, event) => {
    const fieldName = field.name || normalizeName(field.label)
    const type = String(field.type || 'text').toLowerCase()
    const { value, checked } = event.target

    updateFormState((prev) => {
      if (type === 'checkbox' && Array.isArray(field.options)) {
        const currentValues = Array.isArray(prev.values[fieldName]) ? prev.values[fieldName] : []
        const nextValues = checked
          ? [...currentValues, value]
          : currentValues.filter((entry) => entry !== value)

        return {
          ...prev,
          values: { ...prev.values, [fieldName]: nextValues },
        }
      }

      if (type === 'checkbox') {
        return {
          ...prev,
          values: { ...prev.values, [fieldName]: checked },
        }
      }

      return {
        ...prev,
        values: { ...prev.values, [fieldName]: sanitizeFieldValue(field, value) },
      }
    })

    if (!(type === 'checkbox' && Array.isArray(field.options))) {
      updateFormState((prev) => {
        const nextValue =
          type === 'checkbox'
            ? checked
            : sanitizeFieldValue(field, value)

        return {
          ...prev,
          errors: {
            ...prev.errors,
            [fieldName]: getFieldError(field, nextValue),
          },
        }
      })
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = resolvedFields.reduce((acc, field, index) => {
      const name = field.name || normalizeName(field.label || `field_${index + 1}`)
      acc[name] = getFieldError(field, formValues[name])
      return acc
    }, {})

    const hasErrors = Object.values(nextErrors).some(Boolean)

    if (hasErrors) {
      updateFormState((prev) => ({
        ...prev,
        errors: nextErrors,
        submittedData: null,
      }))
      return
    }

    const payload = {
      title: resolvedTitle,
      country,
      requestContext,
      values: formValues,
    }

    updateFormState((prev) => ({
      ...prev,
      errors: nextErrors,
      submittedData: payload,
    }))

    if (typeof onSubmit === 'function') {
      onSubmit(payload)
    }
  }

  const renderField = (field, index) => {
    const type = String(field.type || 'text').toLowerCase()
    const name = field.name || normalizeName(field.label || `field_${index + 1}`)
    const label = field.label || name
    const id = `field-${name}`
    const required = Boolean(field.required)
    const minLength = field['min-length']
    const maxLength = field['max-length']
    const min = field.min
    const max = field.max
    const placeholder = field.placeholder || `Enter ${label.toLowerCase()}`
    const isNumeric = isNumericField(field)
    const sanitizedValue = sanitizeFieldValue(field, formValues[name] || '')

    if (type === 'textarea') {
      return (
        <textarea
          id={id}
          name={name}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          rows={field.rows || 4}
          placeholder={placeholder}
          value={sanitizedValue}
          onChange={(event) => handleFieldChange(field, event)}
        />
      )
    }

    if ((type === 'select' || type === 'dropdown') && Array.isArray(field.options)) {
      return (
        <select
          id={id}
          name={name}
          required={required}
          value={formValues[name] || ''}
          onChange={(event) => handleFieldChange(field, event)}
        >
          <option value="">Select {label}</option>
          {field.options.map((option) => {
            const optionValue = typeof option === 'string' ? option : option.value
            const optionLabel = typeof option === 'string' ? option : option.label

            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            )
          })}
        </select>
      )
    }

    if ((type === 'radio' || type === 'checkbox') && Array.isArray(field.options)) {
      const inputType = type === 'radio' ? 'radio' : 'checkbox'
      const currentValues = formValues[name]

      return (
        <div className="generic-form__option-group" role="group" aria-labelledby={`${id}-label`}>
          {field.options.map((option) => {
            const optionValue = typeof option === 'string' ? option : option.value
            const optionLabel = typeof option === 'string' ? option : option.label
            const optionId = `${id}-${normalizeName(optionValue)}`
            const isChecked =
              inputType === 'radio'
                ? currentValues === optionValue
                : Array.isArray(currentValues) && currentValues.includes(optionValue)

            return (
              <label htmlFor={optionId} key={optionValue} className="generic-form__option-item">
                <input
                  id={optionId}
                  type={inputType}
                  name={name}
                  value={optionValue}
                  required={required && inputType === 'radio'}
                  checked={isChecked}
                  onChange={(event) => handleFieldChange(field, event)}
                />
                <span>{optionLabel}</span>
              </label>
            )
          })}
        </div>
      )
    }

    if (type === 'checkbox') {
      return (
        <label htmlFor={id} className="generic-form__checkbox-row">
          <input
            id={id}
            type="checkbox"
            name={name}
            checked={Boolean(formValues[name])}
            onChange={(event) => handleFieldChange(field, event)}
          />
          <span>{field.description || `I agree to ${label.toLowerCase()}`}</span>
        </label>
      )
    }

    const inputType = NATIVE_INPUT_TYPES.has(type) ? type : 'text'

    return (
      <input
        id={id}
        type={isNumeric ? 'text' : inputType}
        name={name}
        inputMode={isNumeric ? 'numeric' : undefined}
        pattern={isNumeric ? '[0-9]*' : undefined}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        min={min}
        max={max}
        placeholder={placeholder}
        value={isNumeric || isNameLikeField(field) ? sanitizedValue : formValues[name] || ''}
        onChange={(event) => handleFieldChange(field, event)}
      />
    )
  }

  return (
    <section className="generic-form" aria-live="polite">
      <header className="generic-form__header">
        <h2>{resolvedTitle}</h2>
        <p className="generic-form__country">
          Active country: <strong>{country || 'N/A'}</strong>
        </p>
      </header>

      {loading && <p className="generic-form__status">Loading form configuration...</p>}

      {!loading && error && <p className="generic-form__status generic-form__status--error">{error}</p>}

      {!loading && !error && resolvedFields.length === 0 && (
        <p className="generic-form__status">No fields found in the form configuration.</p>
      )}

      {!loading && !error && resolvedFields.length > 0 && (
        <form className="generic-form__panel" onSubmit={handleSubmit}>
          <div className="generic-form__grid">
            {resolvedFields.map((field, index) => {
              const name = field.name || normalizeName(field.label || `field_${index + 1}`)
              const label = field.label || name
              const fieldType = String(field.type || 'text').toLowerCase()
              const isFullWidth = fieldType === 'textarea'

              return (
                <div
                  className={`generic-form__field ${isFullWidth ? 'generic-form__field--full' : ''}`}
                  key={`${name}-${index}`}
                >
                  <label htmlFor={`field-${name}`} id={`field-${name}-label`}>
                    {label}
                    {field.required && <span className="generic-form__required">*</span>}
                  </label>
                  {renderField(field, index)}
                  {fieldErrors[name] && <p className="generic-form__field-error">{fieldErrors[name]}</p>}
                </div>
              )
            })}
          </div>

          <button type="submit" className="generic-form__submit">
            {submitLabel}
          </button>
        </form>
      )}

      {submittedData && (
        <section className="generic-form__result">
          <h3>Submitted Payload</h3>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </section>
      )}

    
    </section>
  )
}

export default GenericForm
