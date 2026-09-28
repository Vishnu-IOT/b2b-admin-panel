import '../../styles/forms.css';

function Field({ label, required, error, hint, children, full }) {
  return (
    <div className={`field ${error ? 'field--error' : ''} ${full ? 'field--full' : ''}`}>
      {label && (
        <label className="field__label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      {children}
      {error ? <div className="field__error">{error}</div> : hint ? <div className="field__hint">{hint}</div> : null}
    </div>
  );
}

export function TextField({ label, required, error, hint, full, ...inputProps }) {
  return (
    <Field label={label} required={required} error={error} hint={hint} full={full}>
      <input className="input" {...inputProps} />
    </Field>
  );
}

export function TextareaField({ label, required, error, hint, full, rows = 6, ...inputProps }) {
  return (
    <Field label={label} required={required} error={error} hint={hint} full={full}>
      <textarea className="textarea" rows={rows} {...inputProps} />
    </Field>
  );
}

export function SelectField({ label, required, error, hint, full, options = [], placeholder, ...selectProps }) {
  return (
    <Field label={label} required={required} error={error} hint={hint} full={full}>
      <select className="select" {...selectProps}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function DateField(props) {
  return <TextField type="date" {...props} />;
}

export { Field };
