const Input = ({ name, type = "text", placeholder, value, onChange, onBlur, required }) => {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      required={required}
      className="border border-gray-300 rounded p-2"
    />
  );
};

export default Input;