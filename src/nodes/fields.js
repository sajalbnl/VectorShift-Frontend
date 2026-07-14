// fields.js
// The form controls a node config can ask for, keyed by `type`.
// Adding a new control type here makes it instantly available to every node.
// --------------------------------------------------

const TextField = ({ inputId, value, onChange, field }) => (
  <input
    id={inputId}
    className="node-control"
    type="text"
    value={value ?? ''}
    placeholder={field.placeholder}
    onChange={(e) => onChange(e.target.value)}
  />
);

const NumberField = ({ inputId, value, onChange, field }) => (
  <input
    id={inputId}
    className="node-control"
    type="number"
    value={value ?? ''}
    placeholder={field.placeholder}
    min={field.min}
    max={field.max}
    step={field.step}
    onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
  />
);

const SelectField = ({ inputId, value, onChange, field }) => (
  <select
    id={inputId}
    className="node-control"
    value={value ?? ''}
    onChange={(e) => onChange(e.target.value)}
  >
    {field.options.map((option) => {
      // Options may be plain strings or { value, label } pairs.
      const { value: optionValue, label } =
        typeof option === 'string' ? { value: option, label: option } : option;
      return (
        <option key={optionValue} value={optionValue}>
          {label}
        </option>
      );
    })}
  </select>
);

const TextAreaField = ({ inputId, value, onChange, field }) => (
  <textarea
    id={inputId}
    className="node-control node-control--area"
    value={value ?? ''}
    rows={field.rows ?? 3}
    placeholder={field.placeholder}
    onChange={(e) => onChange(e.target.value)}
  />
);

const CheckboxField = ({ inputId, value, onChange }) => (
  <input
    id={inputId}
    className="node-control node-control--checkbox"
    type="checkbox"
    checked={Boolean(value)}
    onChange={(e) => onChange(e.target.checked)}
  />
);

const FIELD_COMPONENTS = {
  text: TextField,
  number: NumberField,
  select: SelectField,
  textarea: TextAreaField,
  checkbox: CheckboxField,
};

export const NodeField = ({ nodeId, field, value, onChange }) => {
  const Control = FIELD_COMPONENTS[field.type];

  if (!Control) {
    throw new Error(
      `Unknown field type "${field.type}" on field "${field.name}". ` +
        `Known types: ${Object.keys(FIELD_COMPONENTS).join(', ')}.`
    );
  }

  const inputId = `${nodeId}-${field.name}`;

  return (
    <div className={`node-field node-field--${field.type}`}>
      {field.label && (
        <label className="node-field__label" htmlFor={inputId}>
          {field.label}
        </label>
      )}
      <Control inputId={inputId} field={field} value={value} onChange={onChange} />
    </div>
  );
};

// Used by ui.js to seed a node's `data` at creation time, so the store holds
// complete values from birth rather than nodes inventing defaults at render.
export const resolveFieldDefault = (field, nodeId) =>
  typeof field.default === 'function' ? field.default(nodeId) : field.default;
